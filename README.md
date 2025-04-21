# Netsuite Integration Monorepo

A modern monorepo for Netsuite integration and reporting applications, built with Next.js, TypeScript, and shadcn/ui components.

## 🏗️ Project Structure

```
.
├── apps/
│   ├── list-report/        # List report application
│   └── web/                # Main web application
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── config/             # Shared configuration
│   ├── eslint-config/      # ESLint configuration
│   ├── tsconfig/           # TypeScript configuration
│   └── infrastructure/     # Infrastructure and deployment
└── tools/                  # Development tools and scripts
```

## 📦 Packages

### `@workspace/ui`
Shared UI components built with shadcn/ui and Tailwind CSS. Used across all applications for consistent design.

### `@workspace/config`
Shared configuration files for ESLint, TypeScript, and other tools.

### `@workspace/infrastructure`
Infrastructure and deployment configurations for AWS and other cloud services.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Add UI Components**
   ```bash
   pnpm dlx shadcn@latest add button -c apps/web
   ```

3. **Start Development**
   ```bash
   pnpm dev
   ```

## 🔧 Development Workflow

### Adding New Features
1. Create a new branch from `main`
2. Make changes in the appropriate app or package
3. Run tests and linting
4. Create a pull request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages

### Testing
- Unit tests for components and utilities
- Integration tests for critical flows
- E2E tests for main user journeys

## 📊 Applications

### List Report
A specialized application for generating and managing Netsuite list reports.

## 🛠️ Maintenance

### Monthly Updates
- Update dependencies
- Review and update documentation
- Check and fix security vulnerabilities
- Update infrastructure configurations

### Security
- Regular security audits
- Dependency vulnerability scanning
- Access control reviews

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 Version Control

- Use semantic versioning
- Keep `main` branch stable
- Use feature branches for development
- Regular merges from `main` to keep branches up to date

## 🚨 Troubleshooting

Common issues and their solutions:
- Dependency conflicts: Run `pnpm install --force`
- Build errors: Clear cache and rebuild
- Type errors: Check TypeScript configurations

## 📈 Performance Monitoring

- Regular performance audits
- Monitor build times
- Track bundle sizes
- Optimize critical paths

## 🔍 Code Quality

- Regular code reviews
- Static analysis
- Performance profiling
- Accessibility testing

## 📅 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.
