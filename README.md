<div align="center">
  <img src="https://raw.githubusercontent.com/SEOSiri-Official/firestore-rules-helper/main/images/icon.png" alt="FireRule Guard Logo" width="128" height="128" />
  <h1>FireRule Guard: Firestore Rules Helper</h1>
  <p><strong>⚡️ Supercharge your Firebase development! Automatically generate, lint, and validate secure Firestore rules by scanning your codebase directly within VS Code.</strong></p>
</div>

---

Tired of manually writing `firestore.rules`? Worried about silent security vulnerabilities in your database? **FireRule Guard** is the essential VS Code extension for modern Firebase and Firestore developers. It bridges the critical gap between your application code and your database security, ensuring your rules are robust and scalable.

This powerful tool scans your project for Firestore collection usage (e.g., `.collection('users')`) and generates a complete, secure-by-default `firestore.rules` file for you, saving hours of tedious work and reducing the risk of human error.

This project is an official open-source initiative by the SEO and development experts at **[SEOSiri](http://seosiri.com/)** and is proudly maintained by **[Momenul Ahmad](http://seosiri.com/p/about.html)** to help developers build more secure and efficient applications.

## Key Features

*   **🤖 Automated Rules Generation:** Intelligently scans your JavaScript/TypeScript codebase for `.collection('...')` usage and generates corresponding `match` blocks instantly.
*   **🛡️ Secure By Default:** Creates rules that start with `allow read, write: if false;`, forcing you to explicitly enable access and preventing accidental open databases.
*   **🚀 Boosts Productivity:** Go from a new collection in your code to a fully protected endpoint in seconds. Eliminates the need to manually sync your application logic with your security rules.
*   **💡 Linter & Validator:** Built-in linter to identify common Firestore security anti-patterns like `allow read: if true`.
*   **🎯 Best Practices Built-In:** Embeds security best practices directly into your workflow.

---

## User Guide: Getting Started

Getting started is incredibly simple. Follow these steps to generate your first ruleset in under a minute.

### 1. Installation

*   Install the **"FireRule Guard"** extension directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=SEOSiri.firestore-rules-helper).

### 2. How to Generate Rules

*   **Open Your Project:** Open a Firebase project folder in VS Code.
*   **Run the Generator:**
    *   Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on Mac).
    *   Type and select the command: **"FireRule Guard: Generate Rules from Codebase"**.
*   **Review & Save:** A new `firestore.rules` file will be created or updated with the generated rules. Review the generated match blocks and implement your specific security logic.

---

## Extension Settings

Currently, FireRule Guard does not have any specific settings. Future versions may include configurable paths for scanning.

## Known Issues

*   The extension currently only scans for simple string literals in `.collection()` calls. Dynamic or variable-based collection paths are not yet supported.

Please report any other issues on our [GitHub Issues page](http://github.com/SEOSiri-Official/firestore-rules-helper/issues).

## Release Notes

### 1.0.0

-   Initial release of FireRule Guard.
-   Feature: Automated rules generation from codebase scan.
-   Feature: Live security linter for insecure rules.
-   Secure-by-default `firestore.rules` file creation.

---

## Contributing & Support

This project is open source! We welcome contributions. Please feel free to fork the repository, make changes, and submit a pull request.

*   **Contribute:** Check out our official repository on [GitHub](http://github.com/SEOSiri-Official/firestore-rules-helper).
*   **More Tools:** Discover our other extensions on the [VS Code Marketplace Publisher Page](https://marketplace.visualstudio.com/publishers/SEOSiri).

## License

Distributed under the MIT License. See `LICENSE` for more information.