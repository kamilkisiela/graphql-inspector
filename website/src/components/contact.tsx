import { ComponentProps, FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation } from '../hooks/use-graphql';
import styles from './contact.module.css';

const SAY_HI = /* GraphQL */ `
  mutation SayHi($email: String!) {
    sayHi(email: $email, project: "GRAPHQL_INSPECTOR") {
      ok
    }
  }
`;

const ContactForm: FC = () => {
  const [email, setEmail] = useState('');
  const [result, mutate] = useMutation(SAY_HI);

  const onSubmit = useCallback<NonNullable<ComponentProps<'form'>['onSubmit']>>(
    event => {
      event.preventDefault();
      mutate({ email });
    },
    [email, mutate]
  );

  const onChange = useCallback<NonNullable<ComponentProps<'input'>['onChange']>>(
    event => {
      if (!result.loading) {
        setEmail(event.target.value);
      }
    },
    [setEmail, result.loading]
  );

  useEffect(() => {
    if (result.complete) {
      setEmail('');
    }
  }, [result.complete, setEmail]);

  return (
    <form className={styles.contactForm} onSubmit={onSubmit}>
      <input
        className={styles.contactInput}
        disabled={result.loading}
        type="text"
        value={email}
        onChange={onChange}
        placeholder="Type your email here"
      />
      <button title="Submit" type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
      {result.error && (
        <div className={`${styles.contactStatus} ${styles.error}`}>
          Something went wrong, so please contact us directly on{' '}
          <a className={styles.contactDirectly} href="mailto:kamil.kisiela@gmail.com">
            kamil.kisiela@gmail.com
          </a>
        </div>
      )}
      {result.data && <div className={`${styles.contactStatus} ${styles.success}`}>We'll contact you soon!</div>}
    </form>
  );
};

export const Contact = (): ReactElement => {
  return (
    <div
      className="container justify-around flex w-full flex-col-reverse md:flex-row items-center md:px-16 mt-16 mb-24 gap-10"
      id="contact-us"
    >
      <div className="max-w-lg">
        <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-gray-50">Get in touch!</h3>
        <div className="my-2 text-gray-500 dark:text-gray-400">
          Need help? Want to start using GraphQL Inspector?
          <br /> We would love to help you and hear how you use GraphQL Inspector today!
        </div>
        <ContactForm />
      </div>
      <img className="max-w-[200px]" src="/assets/img/illustrations/mail-box.png" alt="Mail Box" />
    </div>
  );
};
