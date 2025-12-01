# Contributing to Cookie Consent Banner

Thank you for your interest in contributing to Cookie Consent Banner! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node.js version, etc.)
- **Error messages** or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution** (if you have one)
- **Alternatives considered** (if any)

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add or update tests as needed
5. Ensure the code follows the project's style guidelines
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Pull Request Guidelines

- **Keep PRs focused** - One feature or fix per PR
- **Write clear commit messages** - Follow conventional commits format
- **Update documentation** - If you're adding features, update relevant docs
- **Add tests** - For new features or bug fixes
- **Ensure CI passes** - All checks must pass before merge

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Getting Started

```bash
# Clone your fork
git clone https://github.com/yourusername/cookie-consent-banner.git
cd cookie-consent-banner

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build registry
pnpm run registry:build
```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### TypeScript

- All code must be properly typed
- Avoid `any` types - use proper types or `unknown`
- Export types that users might need

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test edge cases and error conditions

### Documentation

- Update README.md if adding new features
- Update relevant docs in the `docs/` directory
- Add code examples where helpful
- Keep JSDoc comments up to date

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(consent): add support for custom consent categories

Allow users to define custom consent categories beyond the default
necessary, analytics, marketing, and preferences categories.

Closes #123
```

```
fix(banner): fix banner not showing on mobile devices

The banner was hidden on mobile due to incorrect z-index calculation.
This fix ensures proper display on all screen sizes.

Fixes #456
```

## Review Process

1. All PRs require at least one review
2. Maintainers will review your PR and may request changes
3. Once approved, a maintainer will merge your PR
4. Thank you for contributing! 🎉

## Questions?

If you have questions about contributing, please:

- Open a [Discussion](https://github.com/yourusername/cookie-consent-banner/discussions)
- Check existing [Issues](https://github.com/yourusername/cookie-consent-banner/issues)
- Read the [Documentation](./docs/README.md)

Thank you for contributing to Cookie Consent Banner! 🙏

