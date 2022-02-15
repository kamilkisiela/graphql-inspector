import { FC, useCallback, useEffect, useState } from 'react';
import { Send } from 'react-feather';
import { Image } from '@chakra-ui/react';
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

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      mutate({ email });
    },
    [email, mutate],
  );

  const onChange = useCallback(
    (event) => {
      if (!result.loading) {
        setEmail(event.target.value);
      }
    },
    [setEmail, result.loading],
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
      <button className={styles.contactSubmit} type="submit">
        <Send />
      </button>
      {result.error && (
        <div className={`${styles.contactStatus} ${styles.error}`}>
          Something went wrong, so please contact us directly on{' '}
          <a
            className={styles.contactDirectly}
            href="mailto:kamil.kisiela@gmail.com"
          >
            kamil.kisiela@gmail.com
          </a>
        </div>
      )}
      {result.data && (
        <div className={`${styles.contactStatus} ${styles.success}`}>
          We&apos;ll contact you soon!
        </div>
      )}
    </form>
  );
};

export const Contact: FC = () => {
  return (
    <div className={styles.contactUsBackground} id="contact-us">
      <div className={styles.contactContainer}>
        <div className={styles.contactSideBySide}>
          <div className={styles.contactMainPart}>
            <h3 className={styles.contactTitle}>Get in touch!</h3>
            <div className={styles.contactLimitContainer}>
              <p className={styles.contactDetails}>
                Need help? Want to start using GraphQL Inspector?
                <br /> We would love to help you and hear how you use GraphQL
                Inspector today!
              </p>
              <ContactForm />
            </div>
          </div>
          <Image
            className={styles.contactMailBox}
            src="/assets/img/illustrations/mail-box.png"
            alt="Mail Box"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
