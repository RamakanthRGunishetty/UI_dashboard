# Analytics UI Dashboard ❄️

A modern, responsive React dashboard implementation based on the [Snow UI](https://snowui.framer.website/) design system. Built with TypeScript, SCSS, and Material-UI, this dashboard provides a comprehensive analytics and data visualization interface.

## 🚀 Live Demo

**[View Live Dashboard →](https://analytics-ui-dashboard.netlify.app/)**

Experience the full functionality of Snow Dashboard with interactive charts, responsive design, and dual theme support.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.0.1-purple.svg)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7.svg)

## 🌟 Features

### Core Features
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop with breakpoint-specific layouts
- **🎨 Dual Theme Support**: Light and dark themes with seamless switching
- **📊 Advanced Data Visualization**: Interactive charts, graphs, and analytics widgets
- **🗺️ Geographic Data**: World map integration with location-based revenue tracking
- **📋 Data Management**: Comprehensive order list with filtering and sorting
- **🎯 Modern UI Components**: Reusable, accessible components following Material Design principles

### Technical Features
- **⚡ High Performance**: Optimized with Vite for fast builds and hot module replacement
- **🏗️ Modular Architecture**: Clean component separation with containers, views, and utilities
- **🎛️ State Management**: Context API for global state handling
- **♿ Accessibility**: ARIA compliant with keyboard navigation support

### Order Management Features
- **➕ Add Orders**: Full-featured modal form for creating new orders
- **✅ Real-time Validation**: Form validation with instant error feedback
- **🎯 Dynamic Updates**: Orders appear instantly with smooth animations
- **📊 Comprehensive Data**: Customer info, project details, amounts, and status tracking
- **🎨 Responsive Design**: Optimized forms for all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/snow-dashboard.git
   cd snow-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   ├── Card/
│   ├── Icon/
│   ├── Search/
│   └── ...
├── containers/          # Business logic components
│   ├── LeftSidebar/
│   ├── Navbar/
│   ├── BarChart/
│   ├── LineChart/
│   └── ...
├── views/              # Main application views
│   ├── Dashboard/
│   ├── Orders/
│   └── Home/
├── contexts/           # React Context providers
│   ├── navigationContext.tsx
│   └── themeContext.tsx
├── data/              # Static JSON data
│   ├── activities.json
│   ├── contacts.json
│   └── ...
├── styles/            # Global SCSS styles
│   ├── config.scss
│   ├── variables.scss
│   └── index.scss
└── types/             # TypeScript type definitions
    ├── global.d.ts
    └── MenuTypes.ts
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.6.2** - Static type checking for better developer experience
- **SCSS** - Advanced CSS preprocessing with variables and mixins
- **Material-UI 6.1.4** - Comprehensive React component library

### Data Visualization
- **@mui/x-charts 7.21.0** - Advanced charting components
- **@mui/x-data-grid 7.21.0** - Feature-rich data table
- **react-simple-maps 3.0.0** - SVG-based map visualization

### Build Tools
- **Vite 6.0.1** - Next-generation frontend build tool
- **ESLint** - Code quality and consistency
- **sass-embedded** - Dart Sass compiler

## 📊 Dashboard Components

### Analytics Widgets
- **Revenue Charts**: Line and bar charts showing financial data
- **Performance Metrics**: Key performance indicators with trend analysis
- **Geographic Revenue**: Interactive world map with location-based data
- **Sales Overview**: Pie charts and statistical summaries

### Data Management
- **Order List**: Comprehensive order management with sorting, filtering, and real-time addition
- **Add Order Modal**: Full-featured form for creating new orders with validation
- **Customer Data**: User information and activity tracking
- **Product Analytics**: Top products and inventory insights

### Navigation
- **Context-Aware Breadcrumbs**: Dynamic page titles and navigation paths
- **Multi-level Menu**: Hierarchical navigation with sub-menus

## 🎨 Design System

### Responsive Breakpoints
- **Mobile**: < 480px (drawer navigation)
- **Small Tablet**: 480px - 768px (icon-only sidebar)
- **Large Tablet**: 768px - 1024px (expanded sidebar on click)
- **Desktop**: ≥ 1024px (full sidebar always visible)

### Theme System
- **Light Theme**: Clean, modern interface with high contrast
- **Dark Theme**: Eye-friendly dark mode with proper color contrast
- **Dynamic Switching**: Seamless theme transitions with localStorage persistence


### Customization
- **Colors**: Modify `src/styles/variables.scss` for theme colors
- **Typography**: Update font families and sizes in `src/styles/config.scss`
- **Breakpoints**: Adjust responsive breakpoints in component styles

## 📱 Responsive Features

### Mobile Experience
- Touch-friendly interface with optimized tap targets
- Swipe gestures for Left sidebar navigation
- Compressed data views for smaller screens

### Tablet Adaptations
- Icon-only sidebar with expand-on-click functionality
- Optimized chart sizing for medium screens
- Touch-optimized controls and interactions

### Desktop Experience
- Full sidebar navigation always visible
- Expanded data tables with all columns
- Hover states and desktop-specific interactions
- Keyboard navigation support

## 🚀 Deployment

The Analytics UI Dashboard is currently deployed and accessible at:

**Production URL**: [https://analytics-dashboard-hub.netlify.app/](https://analytics-dashboard-hub.netlify.app/)

### Deployment Features
- ✅ **Live & Production Ready**: Fully functional dashboard with all features
- ✅ **Responsive Design**: Test mobile, tablet, and desktop layouts
- ✅ **Theme Switching**: Experience both light and dark themes
- ✅ **Interactive Charts**: Explore all data visualizations
- ✅ **Real-time Performance**: Optimized loading and smooth interactions

### Deploy Your Own
The project is optimized for various hosting platforms:
- **Netlify**: Current deployment platform
- **Vercel**: One-click deployment support
- **GitHub Pages**: Static hosting compatible
- **Custom Server**: Node.js/Express deployment ready

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Design inspired by [Snow UI](https://snowui.framer.website/)
- Icons from Material Design Icons
- Charts powered by MUI X Components

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the documentation in `/docs`
- Review the component examples in `/src/components`

---

Built with ❤️ using React, TypeScript, and modern web technologies.
