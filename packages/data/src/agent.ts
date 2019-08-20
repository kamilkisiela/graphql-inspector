import {
  GraphQLSchema,
  DocumentNode,
  Source,
  isSchema,
  printSchema,
  print,
} from 'graphql';
import {createHash} from 'crypto';
import axios from 'axios';
import * as os from 'os';
import * as retry from 'async-retry';

import {isSource, compress} from './helpers';
import {InspectorExtension, InspectorExtensionOptions} from './extension';
import {Trace, Metadata, Report} from './types';

export interface InspectorAgentOptions {
  schema: GraphQLSchema | DocumentNode | Source | string;
  tag: string;
  endpointUrl: string;
  /**
   * 30s by default
   */
  timeout?: number;
  /**
   * false by default
   */
  debug?: boolean;
  /**
   * 5 by default
   */
  maxRetries?: number;
  /**
   * 200 by default
   */
  minTimeout?: number;
  /**
   * Send report after each GraphQL operation
   */
  sendImmediately?: boolean;
  /**
   * Send reports in interval (defaults to 10000ms)
   */
  sendInterval?: number;
  /**
   * Max number of traces to send at once (defaults to 25)
   */
  maxSize?: number;
  /**
   * Make adjustements, clear sensitive data
   */
  transformError?: InspectorExtensionOptions['transformError'];
}

export class InspectorAgent {
  options: Required<Exclude<InspectorAgentOptions, 'schema'>>;
  schemaHash: string;
  metadata?: Metadata;
  report?: Report;
  intervalID: any;

  constructor(options: InspectorAgentOptions) {
    this.options = {
      tag: options.tag,
      endpointUrl: options.endpointUrl,
      timeout: 30000,
      debug: false,
      minTimeout: 200,
      maxRetries: 5,
      sendImmediately: false,
      sendInterval: 10000,
      maxSize: 25,
      transformError: error => error,
      ...options,
    };

    this.schemaHash = this.generateSchemaHash(
      this.stringifySchema(options.schema),
    );

    this.metadata = {
      agent: `1.2.3`,
      runtime: `node ${process.version}`,
      uname: `${os.platform()}, ${os.type()}, ${os.release()}, ${os.arch()}`,
      hostname: os.hostname(),
      schemaHash: this.schemaHash,
      schemaTag: this.options.tag,
    };

    this.report = {
      metadata: this.metadata,
      traces: [],
    };

    if (!this.options.sendImmediately) {
      this.intervalID = setInterval(() => {
        this.send().catch(e => {
          console.error(e);
        });
      }, this.options.sendInterval);
    }
  }

  extension() {
    return new InspectorExtension({
      onTrace: trace => {
        this.addTrace(trace);
      },
      transformError: this.options.transformError,
    });
  }

  private addTrace(trace: Trace): void {
    this.report!.traces.push(trace);

    if (
      this.options.sendImmediately ||
      this.report!.traces.length >= this.options.maxSize
    ) {
      setImmediate(() => {
        this.send().catch(e => {
          console.error(e);
        });
      });
    }
  }

  private async send() {
    const report = this.report;
    this.resetReport();

    if (!report!.traces.length) {
      return;
    }

    const compressed = await compress(report!);

    const sendReport: retry.RetryFunction<any> = async (_bail, attempt) => {
      this.debugLog(`Sending a report (attempt ${attempt})`);

      const response = await axios.post(this.options.endpointUrl, compressed, {
        headers: {
          'content-type': 'application/json',
          'content-encoding': 'gzip',
        },
        validateStatus: status => status >= 200 && status < 300,
        timeout: this.options.timeout,
      });

      if (response.status >= 500 && response.status < 600) {
        this.debugLog(
          `Attempt ${attempt} failed: ${response.status} - ${response.statusText}`,
        );
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response;
    };

    const response = await retry(sendReport, {
      retries: this.options.maxRetries,
      minTimeout: this.options.minTimeout,
      factor: 2,
    }).catch((error: Error) => {
      console.error(error);
      throw new Error(`Error sending report: ${error}`);
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Error sending report to Apollo Engine servers (HTTP status ${response.status}): ${response.data}`,
      );
    }

    this.debugLog(`Report sent!`);
  }

  private resetReport() {
    this.report = {
      metadata: this.report!.metadata,
      traces: [],
    };
  }

  private generateSchemaHash(schema: string) {
    return createHash('sha512')
      .update(schema)
      .digest('hex');
  }

  private stringifySchema(
    schema: GraphQLSchema | DocumentNode | Source | string,
  ): string {
    if (typeof schema === 'string') {
      return schema;
    }

    if (isSchema(schema)) {
      return printSchema(schema);
    }

    if (isSource(schema)) {
      return schema.body;
    }

    return print(schema);
  }

  private debugLog(msg: string) {
    if (this.options.debug) {
      console.log(msg);
    }
  }
}
