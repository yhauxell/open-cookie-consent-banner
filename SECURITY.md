# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Open Cookie Consent Banner seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue
- Discuss the vulnerability in public forums or chat rooms
- Share the vulnerability with others until it has been resolved

### Please DO:

1. **Email us directly** at: your.email@example.com

   - Include "SECURITY" in the subject line
   - Provide a detailed description of the vulnerability
   - Include steps to reproduce the issue
   - Describe the potential impact

2. **Wait for our response** - We will acknowledge receipt within 48 hours

3. **Give us time** - We'll work with you to understand and resolve the issue quickly

### What to Expect

- **Acknowledgment**: We'll confirm receipt of your report within 48 hours
- **Initial Assessment**: We'll provide an initial assessment within 7 days
- **Updates**: We'll keep you informed of our progress
- **Resolution**: We'll work to resolve the issue as quickly as possible
- **Credit**: With your permission, we'll credit you in our security advisories

### Security Best Practices

When using Open Cookie Consent Banner:

1. **Keep dependencies updated** - Regularly update all dependencies
2. **Use HTTPS** - Always serve your application over HTTPS
3. **Validate input** - Validate all user input on the server side
4. **Secure API endpoints** - Protect your consent tracking endpoints
5. **Review configurations** - Regularly review your consent configuration
6. **Monitor for updates** - Subscribe to security advisories

### Known Security Considerations

- **Client-side storage**: Consent data is stored in localStorage, which is accessible to JavaScript. This is by design for client-side consent management.
- **API endpoints**: Ensure your consent tracking endpoints are properly secured and rate-limited.
- **Third-party scripts**: Be cautious when loading third-party scripts based on consent - validate all script sources.

### Security Updates

Security updates will be released as patch versions (e.g., 0.1.0 → 0.1.1). We recommend:

- Keeping your dependencies up to date
- Subscribing to GitHub releases
- Monitoring the [Security Advisories](https://github.com/yourusername/cookie-consent-banner/security/advisories)

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the issue and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release fixes and security advisories

We follow responsible disclosure practices and will coordinate with reporters on disclosure timing.

Thank you for helping keep Open Cookie Consent Banner and its users safe!
