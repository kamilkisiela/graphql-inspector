import React, {useState, useCallback, useEffect} from 'react';
import Image from '@theme/IdealImage';
import {Send} from 'react-feather';
import styles from './contact.module.css';

import {useMutation} from '../hooks/use-graphql';

function ContactForm({className}) {
  const [email, setEmail] = useState();
  const [result, mutate] = useMutation(
    `mutation sayHi($email: String!, $project: String!) { sayHi(email: $email, project: $project) { ok } }`,
  );
  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      mutate({email, project: 'GRAPHQL_INSPECTOR'});
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
    <div className={className}>
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
            We'll contact you soon!
          </div>
        )}
      </form>
    </div>
  );
}

export const Contact = () => {
  return (
    <div className={styles.contactUsBackground} id="contact-us">
      <div className={`${styles.contactContainer} container`}>
        <div className={styles.contactSideBySide}>
          <div className={styles.contactMainPart}>
            <h3 className={styles.contactTitle}>Get in touch!</h3>
            <div className={styles.contactLimitContainer}>
              <p className={styles.contactDetails}>
                Need help? Want to start using GraphQL Inspector?
                <br /> We would love to help you and hear how you use GraphQL
                Inspector today!
              </p>
              <div className="contact-wrapper">
                <ContactForm />
              </div>
            </div>
          </div>
          <div className={styles.contactMailBox}>
            <Image
              img={require('../../static/img/illustrations/mail-box.png')}
              alt="Mail Box"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
