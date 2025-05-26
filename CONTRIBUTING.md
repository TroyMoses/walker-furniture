# Contributing to Exit Walker Furniture

Thank you for your interest in contributing to Exit Walker Furniture! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce the problem
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and device information

### Suggesting Features

1. **Check the roadmap** to see if the feature is already planned
2. **Create a feature request** with detailed description
3. **Explain the use case** and why it would be valuable
4. **Consider implementation complexity** and alternatives

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   \`\`\`bash
   git clone https://github.com/TroyMoses/walker-furniture.git
   \`\`\`
3. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`
4. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

#### Development Guidelines

##### Code Style
- Use **TypeScript** for all new code
- Follow **existing naming conventions**
- Use **functional components** with hooks
- Implement **proper error handling**
- Add **TypeScript interfaces** for all props

##### Component Guidelines
- **Reusable components** should be in \`components/\` directory
- **Page-specific components** can be in the same directory as the page
- **Use shadcn/ui components** when possible
- **Follow accessibility best practices**

##### Styling Guidelines
- Use **Tailwind CSS** utility classes
- Follow the **existing color scheme** (amber-based)
- Ensure **responsive design** for all screen sizes
- Use **gradient backgrounds** consistently with the design system

##### Animation Guidelines
- Use **AOS animations** for scroll-triggered effects
- Keep animations **subtle and professional**
- Use appropriate **delays for staggered effects**
- Test animations on **different devices and browsers**

#### Testing Your Changes

1. **Test on multiple browsers**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)

2. **Test responsive design**
   - Mobile (&lt; 768px)
   - Tablet (768px - 1024px)
   - Desktop (> 1024px)

3. **Verify accessibility**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast ratios

4. **Check performance**
   - Page load times
   - Animation smoothness
   - Image optimization

#### Submitting Changes

1. **Commit your changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add new product filtering feature"
   \`\`\`

2. **Use conventional commit messages**
   - \`feat:\` for new features
   - \`fix:\` for bug fixes
   - \`docs:\` for documentation changes
   - \`style:\` for formatting changes
   - \`refactor:\` for code refactoring
   - \`test:\` for adding tests
   - \`chore:\` for maintenance tasks

3. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

4. **Create a Pull Request**
   - Use the PR template
   - Provide clear description of changes
   - Link related issues
   - Add screenshots for UI changes

## 📋 Pull Request Guidelines

### PR Checklist
- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation have been made
- [ ] Changes generate no new warnings
- [ ] New and existing tests pass locally
- [ ] Responsive design has been tested
- [ ] Accessibility guidelines have been followed

### PR Description Template
\`\`\`markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe the tests that you ran to verify your changes.

## Screenshots
If applicable, add screenshots to help explain your changes.

## Related Issues
Fixes #(issue number)
\`\`\`

## 🎨 Design Guidelines

### Color Palette
- **Primary**: Amber shades (#92400e, #d97706, #f59e0b)
- **Neutral**: Grays and whites
- **Success**: Green shades
- **Warning**: Yellow/orange shades
- **Error**: Red shades

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: font-bold (700) or font-semibold (600)
- **Body Text**: font-normal (400)
- **Small Text**: font-medium (500)

### Spacing
- Use Tailwind's spacing scale (4, 8, 12, 16, 20, 24, etc.)
- Consistent padding and margins throughout
- Proper spacing between sections

### Components
- Follow shadcn/ui patterns and conventions
- Maintain consistent component APIs
- Use proper TypeScript interfaces
- Include proper accessibility attributes

## 🚀 Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git

### Environment Setup
1. **Clone the repository**
2. **Install dependencies**
3. **Start development server**
4. **Open browser** to http://localhost:3000

### Useful Commands
\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Git workflow
git status           # Check file status
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Push to remote
\`\`\`

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Tools
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [TypeScript Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Bug Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, device information
6. **Screenshots**: If applicable
7. **Console Errors**: Any JavaScript errors in the console

## 💡 Feature Requests

When suggesting features, please include:

1. **Feature Description**: Clear description of the proposed feature
2. **Use Case**: Why this feature would be valuable
3. **Implementation Ideas**: Suggestions for how it could be implemented
4. **Alternatives**: Other ways to achieve the same goal
5. **Priority**: How important this feature is to you

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Email**: support@walkerfurnitures.com for direct support

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks in documentation

Thank you for contributing to Exit Walker Furniture! 🏠✨
