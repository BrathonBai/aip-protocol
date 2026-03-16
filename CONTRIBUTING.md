# Contributing to AIP (Agent Interoperability Protocol)

First off, thank you for considering contributing to AIP! 🎉

The goal of this project is to create a universal standard for AI agent communication. We need input from developers, researchers, and anyone building with AI agents.

## How Can I Contribute?

### 1. Provide Feedback on the Protocol

The most valuable contribution right now is **feedback on the protocol design**.

- Read the [RFC](./RFC_AIP.md)
- Open an issue with your thoughts
- Join discussions on existing issues

**Questions to consider**:
- Is the protocol simple enough?
- Is it extensible enough?
- What use cases are we missing?
- What security concerns do you have?

### 2. Implement the Protocol

Help us prove interoperability by implementing AIP in your platform:

- Build an AIP client in another language (Python, Go, Rust, etc.)
- Integrate AIP into your existing agent framework
- Test interoperability with our reference implementation

### 3. Improve the Reference Implementation

The TypeScript reference implementation can always be better:

- Add tests
- Improve error handling
- Add features from the roadmap
- Fix bugs
- Improve documentation

### 4. Create Examples and Tutorials

Help others understand and use AIP:

- Write tutorials
- Create example agents
- Make demo videos
- Write blog posts

### 5. Improve Documentation

- Fix typos
- Clarify confusing sections
- Add diagrams
- Translate to other languages

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/aip-protocol.git
cd aip-protocol

# Install dependencies
npm install

# Build the SDK
cd agent-sdk && npm install && npm run build && cd ..

# Build the server
cd server && npm install && npm run build && cd ..

# Run tests
npm test

# Run the demo
node test-a2a.js
```

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test** your changes
5. **Commit** with a clear message:
   ```bash
   git commit -m "Add feature: description of what you did"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** on GitHub

### PR Guidelines

- Keep PRs focused (one feature/fix per PR)
- Write clear commit messages
- Add tests for new features
- Update documentation if needed
- Follow the existing code style

## Code Style

We use:
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type safety

Run before committing:
```bash
npm run lint
npm run format
```

## Commit Message Format

Use conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(sdk): add message signing support
fix(server): handle disconnection gracefully
docs(rfc): clarify capability declaration format
```

## Reporting Bugs

Found a bug? Please open an issue with:

1. **Description**: What happened?
2. **Expected behavior**: What should have happened?
3. **Steps to reproduce**: How can we reproduce it?
4. **Environment**: OS, Node version, etc.
5. **Logs**: Any relevant error messages

## Suggesting Features

Have an idea? Open an issue with:

1. **Use case**: What problem does it solve?
2. **Proposed solution**: How would it work?
3. **Alternatives**: What other approaches did you consider?
4. **Impact**: Who would benefit?

## Protocol Changes

Changes to the protocol specification require more discussion:

1. Open an issue first to discuss the change
2. Get feedback from maintainers and community
3. Update the RFC with the proposed change
4. Implement in the reference implementation
5. Test interoperability

## Community Guidelines

- **Be respectful**: Treat everyone with respect
- **Be constructive**: Focus on ideas, not people
- **Be patient**: This is a volunteer project
- **Be open**: Consider different perspectives
- **Be helpful**: Help others learn and contribute

## Questions?

- Open an issue with the `question` label
- Join our Discord (coming soon)
- Email: aip@adventurers-guild.dev (coming soon)

## License

By contributing, you agree that your contributions will be licensed under:
- **MIT License** for code
- **CC0 (Public Domain)** for protocol specification

## Recognition

Contributors will be recognized in:
- README.md
- Release notes
- Project website (when available)

Thank you for helping build the future of agent interoperability! 🚀
