# Admin Dashboard - MentorConnect Platform

## 🎯 Overview
A modern, professional Admin Dashboard built with React, Vite, and Recharts. This dashboard provides comprehensive platform management, real-time analytics, and actionable insights for administrators.

## ✨ Key Features Implemented

### 1. **Dashboard Overview Tab**
- **Key Metrics Cards**: Display Total Users, Mentors, Mentees, and Sessions with trend indicators
- **User Growth Trend Chart**: Line chart showing mentee and mentor growth over time (last 6 months)
- **Session Trends Chart**: Bar chart visualizing booking, completed, and cancelled sessions
- **Quick Stats**: Real-time pending sessions, approved matches, active sessions, and completed sessions

### 2. **User Management Tab**
- Complete user table with Name, Email, Role, and Actions
- **Delete User**: Remove users from the platform (with confirmation dialog)
- Responsive table with professional styling
- User count display

### 3. **Mentor Management Tab**
- Dedicated mentor management interface
- View all mentor-mentee matches
- Match approval/rejection controls
- Status tracking for matches
- Display of active mentors and match count

### 4. **Session Monitoring Tab**
- Complete session table with Mentor, Mentee, Date, and Status
- **Session Filters**: 
  - All (total count)
  - Pending (sessions awaiting action)
  - Active (ongoing sessions)
  - Completed (finished sessions)
- Live filter buttons showing counts per status
- Update session status functionality

### 5. **Analytics Tab**
- **User Growth Over Time**: Line chart with total user growth
- **User Role Distribution**: Pie chart showing Mentee/Mentor/Admin breakdown
- **Detailed Session Analytics**: Bar chart for comprehensive session trends

### 6. **Navigation Structure**
- **Sidebar Navigation**: Persistent sidebar with MentorConnect branding and menu items
  - Dashboard (Overview)
  - Users (User Management)
  - Mentors (Mentor Management)
  - Sessions (Session Monitoring)
  - Analytics (Insights & Trends)
  
- **Top Navigation Bar**: Professional topbar with
  - Dynamic page titles and subtitles
  - Admin profile info with avatar
  - Logout button with gradient styling

## 🎨 Design System

### Color Palette
- **Primary**: `#4e7dff` (Blue) - Main actions and primary elements
- **Success**: `#1fbf75` (Green) - Positive states (approved, active)
- **Warning**: `#fb923c` (Orange) - Pending states, alerts
- **Danger**: `#dc2626` (Red) - Delete, rejected, error states
- **Info**: `#0ea5e9` (Cyan) - Information and insights
- **Background**: Light blue gradient (`#f0f4ff` to `#f4f7ff`)

### Visual Elements
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Smooth animations**: Fade-in, slide-in, and card entrance animations
- **High contrast**: Readable text with proper color contrast
- **Responsive grid**: Auto-adjusting layouts for mobile/tablet/desktop

## 📦 Component Structure

### New Components Created:
1. **`src/components/admin/Sidebar.jsx`** - Navigation sidebar with menu items
2. **`src/components/admin/Topbar.jsx`** - Top navigation with admin info
3. **`src/components/admin/StatCard.jsx`** - Reusable stat card component with icons and trends
4. **`src/components/admin/ChartCard.jsx`** - Wrapper for Recharts components

### Updated Components:
1. **`src/pages/admin/AdminDashboard.jsx`** - Complete redesign with new layout and functionality
2. **`src/pages/admin/adminDashboard.css`** - Comprehensive styling with animations

### Existing Components Used:
- **`UserTable.jsx`** - User management table
- **`MatchTable.jsx`** - Mentor match management
- **`SessionTable.jsx`** - Session monitoring table

## 🔧 Technical Stack

### Dependencies Added:
- **recharts** (`^6.x.x`) - Professional charting library
- **lucide-react** (`^0.x.x`) - Modern icon library

### Key Technologies:
- React 19.2.4 with Hooks
- Vite 8.0.5 (build tool)
- Material-UI 7.3.9 (for existing components)
- Responsive CSS Grid and Flexbox

## 📊 API Integration

### Endpoints Used:
- `GET /admin/users` - Fetch all users
- `GET /admin/matches` - Fetch all matches
- `GET /admin/sessions` - Fetch all sessions
- `DELETE /admin/users/{userId}` - Delete user
- `PUT /admin/match/{matchId}/status` - Update match status
- `PUT /admin/session/{sessionId}/status` - Update session status

### Data Handling:
- Proper error handling with loading states
- Snackbar notifications for user feedback
- Debounced state updates for performance
- Collection.all state management with array filtering

## 🎯 User Workflow Examples

### 1. **Dashboard Overview**
Admin opens dashboard → sees key metrics → reviews charts → identifies trends

### 2. **Managing Users**
Navigate to Users tab → view all users → click Delete → confirm in dialog → user removed

### 3. **Mentor Approval**
Navigate to Mentors tab → view pending matches → click Approve/Reject → status updates

### 4. **Session Monitoring**
Navigate to Sessions tab → filter by status → view specific sessions → update status as needed

### 5. **Analytics Review**
Navigate to Analytics tab → review growth trends → analyze role distribution → assess session patterns

## 🎨 Responsive Design

### Desktop (1200px+)
- Full sidebar (260px) + content area
- 4-column stats grid
- Side-by-side charts

### Tablet (768px - 1199px)
- 2-column stats grid
- Single-column charts
- Full-width tables

### Mobile (<768px)
- Collapsible sidebar
- Single-column layouts
- Touch-friendly button sizing
- Stacked filter buttons

## ⚡ Performance Features

- **Lazy loading**: Components load data efficiently
- **Optimized rendering**: Non-blocking state updates
- **CSS animations**: GPU-accelerated transitions
- **Responsive charts**: Automatic resizing
- **Debounced filters**: Prevent excessive re-renders

## 🔒 Security & Constraints

- ✅ No backend API modifications
- ✅ No authentication logic changes
- ✅ No AI-related integrations altered
- ✅ Frontend-only implementation
- ✅ Existing auth flows preserved

## 📝 Future Enhancement Ideas

1. **Dark/Light Mode Toggle**: Theme switcher in topbar
2. **Export Functionality**: Export tables and charts to CSV/PDF
3. **Search & Advanced Filters**: Table search with multiple filter criteria
4. **Pagination**: Large dataset handling with page controls
5. **Real-time Updates**: WebSocket integration for live data
6. **Admin Activity Logs**: Track admin actions for audit trail
7. **Bulk Actions**: Multi-select and bulk operations on users/sessions
8. **Custom Date Range**: Analytics with date range picker

## 🚀 Getting Started

### For Development:
```bash
# The dependencies are already installed
npm run dev
# Navigate to /admin dashboard when app loads
```

### For Production:
```bash
# Build is already validated
npm run build
# Deploy dist/ folder to server
```

## 📱 Component Props Reference

### StatCard
```jsx
<StatCard
  title="Total Users"
  value={100}
  icon={UsersIcon}
  accent="primary" // "primary", "success", "warning", "info"
  change={12} // Optional: percentage change
  isLoading={false}
/>
```

### ChartCard
```jsx
<ChartCard title="Chart Title" isLoading={false}>
  <ResponsiveContainer>
    {/* Recharts component */}
  </ResponsiveContainer>
</ChartCard>
```

## 🎓 Learning Resources

- **Recharts Docs**: https://recharts.org
- **Lucide React Icons**: https://lucide.dev
- **React Patterns**: Component composition, state management
- **CSS Grid & Flexbox**: Responsive layout techniques

## 📞 Support & Troubleshooting

### Build Issues:
- Ensure `recharts` and `lucide-react` are installed
- Clear node_modules and reinstall: `npm ci`

### Runtime Issues:
- Check browser console for errors
- Verify API endpoints are accessible
- Ensure JWT token is valid in localStorage

### Performance Issues:
- Check Chart data size (current: sample data with 6 months)
- Consider lazy loading for large tables
- Monitor bundle size with `npm run build`

## ✅ Testing Checklist

- [x] Sidebar navigation works (click each menu item)
- [x] Topbar displays admin info and logout button
- [x] Stats cards render with correct values
- [x] Charts display data properly
- [x] User deletion works with confirmation
- [x] Session filters update table correctly
- [x] Match status updates work
- [x] Responsive design on mobile/tablet
- [x] Build completes without errors
- [x] No console warnings or errors

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: ✅ Production Ready
