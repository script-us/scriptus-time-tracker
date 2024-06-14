import React from "react";
import styles from "./Modules.module.scss";

const Modules = () => {
  return (
    <>
      <div className={styles.chooseModuleScreen}>
        <div>
          <h1 className={styles.title}>Select Module</h1>
          <div className={styles.btnWrapper}>
            <div className={styles.panel}>
              <p className={styles.module}> Redmine </p>
              <div className={styles.ribbon}>
                <span className={styles.inner}>
                  <span className={styles.text}></span>
                </span>
              </div>
            </div>
            <div className={styles.panel}>
              <p className={styles.module}> Other </p>
              <div className={styles.ribbon}>
                <span className={styles.inner}>
                  <span className={styles.text}></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modules;
