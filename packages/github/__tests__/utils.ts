import { ChangeType, CriticalityLevel } from '@graphql-inspector/core';
import { createSummary } from '../src/helpers/utils';

describe('Limit summary', () => {
  test('all changes when total amount is below limit', () => {
    const summary = createSummary(
      [
        {
          type: ChangeType.FieldRemoved,
          message: 'breaking-1',
          criticality: {
            level: CriticalityLevel.Breaking,
          },
        },
        {
          type: ChangeType.FieldRemoved,
          message: 'breaking-2',
          criticality: {
            level: CriticalityLevel.Breaking,
          },
        },
        {
          type: ChangeType.FieldAdded,
          message: 'safe-3',
          criticality: {
            level: CriticalityLevel.NonBreaking,
          },
        },
      ],
      3,
    );

    expect(summary).toContain('- breaking-1');
    expect(summary).toContain('- breaking-2');
    expect(summary).toContain('- safe-3');
    expect(summary).not.toContain('summaryLimit');
  });

  test('only breaking changes when total is above limit and breaking is below or equal', () => {
    const summary = createSummary(
      [
        {
          type: ChangeType.FieldRemoved,
          message: 'breaking-1',
          criticality: {
            level: CriticalityLevel.Breaking,
          },
        },
        {
          type: ChangeType.FieldRemoved,
          message: 'breaking-2',
          criticality: {
            level: CriticalityLevel.Breaking,
          },
        },
        {
          type: ChangeType.FieldRemoved,
          message: 'breaking-3',
          criticality: {
            level: CriticalityLevel.Breaking,
          },
        },
        {
          type: ChangeType.FieldAdded,
          message: 'safe-4',
          criticality: {
            level: CriticalityLevel.NonBreaking,
          },
        },
      ],
      3,
    );

    expect(summary).toContain('- breaking-1');
    expect(summary).toContain('- breaking-2');
    expect(summary).toContain('- breaking-3');
    expect(summary).not.toContain('- safe-4');
    expect(summary).toContain('summaryLimit');
  });

  test('empty when total and breaking are above limit', () => {
    const summary = createSummary(
      [
        {
          type: ChangeType.FieldRemoved,
          message: 'breaking-1',
          criticality: {
            level: CriticalityLevel.Breaking,
          },
        },
        {
          type: ChangeType.FieldRemoved,
          message: 'breaking-2',
          criticality: {
            level: CriticalityLevel.Breaking,
          },
        },
        {
          type: ChangeType.FieldRemoved,
          message: 'breaking-3',
          criticality: {
            level: CriticalityLevel.Breaking,
          },
        },
        {
          type: ChangeType.FieldAdded,
          message: 'safe-4',
          criticality: {
            level: CriticalityLevel.NonBreaking,
          },
        },
      ],
      2,
    );

    expect(summary).not.toContain('- breaking-1');
    expect(summary).not.toContain('- breaking-2');
    expect(summary).not.toContain('- breaking-3');
    expect(summary).not.toContain('- safe-4');
    expect(summary).toContain('summaryLimit');
  });
});
