import React from 'react'
import { Box, Button, H1, H2, Icon, Text } from '@adminjs/design-system'
import { useSelector } from 'react-redux'

const resourceMeta = {
  User: { label: 'Customers', icon: 'User', color: '#2563eb' },
  Food: { label: 'Foods', icon: 'ShoppingBag', color: '#f97316' },
  Seller: { label: 'Sellers', icon: 'Store', color: '#16a34a' },
  Order: { label: 'Orders', icon: 'ShoppingCart', color: '#9333ea' },
  DeliveryPerson: { label: 'Couriers', icon: 'Truck', color: '#0891b2' },
  Category: { label: 'Categories', icon: 'Grid', color: '#dc2626' },
  Address: { label: 'Addresses', icon: 'MapPin', color: '#4b5563' },
}

const styles = {
  page: {
    minHeight: '100%',
    background: '#f6f7fb',
    padding: '32px',
  },
  hero: {
    background: 'linear-gradient(135deg, #111827 0%, #1f2937 55%, #f97316 100%)',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '34px',
    marginBottom: '24px',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: '24px',
    alignItems: 'center',
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '18px',
    boxShadow: '0 8px 24px rgba(17, 24, 39, 0.06)',
  },
  iconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '8px',
    display: 'grid',
    placeItems: 'center',
    color: '#ffffff',
    marginBottom: '14px',
  },
  panel: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '22px',
  },
  quickLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    marginTop: '16px',
  },
  link: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '14px',
    textDecoration: 'none',
    color: '#111827',
    background: '#ffffff',
  },
}

const Dashboard = () => {
  const resourcesState = useSelector((state) => state.resources || [])
  const resources = Array.isArray(resourcesState)
    ? resourcesState
    : Object.values(resourcesState || {})
  const visibleResources = resources.filter((resource) => resource?.href)

  return (
    <Box style={styles.page}>
      <Box style={styles.hero}>
        <Box>
          <Text style={{ color: '#fed7aa', fontWeight: 700, marginBottom: 8 }}>
            Food Dash Operations
          </Text>
          <H1 style={{ color: '#ffffff', margin: 0 }}>Admin Control Center</H1>
          <Text style={{ color: '#f3f4f6', maxWidth: 620, marginTop: 12 }}>
            Manage menu items, categories, sellers, orders, couriers, customers, and saved addresses from one focused workspace.
          </Text>
        </Box>
        <Box style={styles.heroActions}>
          <Button as="a" href="/admin/resources/Food/actions/new" variant="primary">
            Add food
          </Button>
          <Button as="a" href="/admin/resources/Order" variant="light">
            View orders
          </Button>
        </Box>
      </Box>

      <Box style={styles.grid}>
        {visibleResources.map((resource) => {
          const meta = resourceMeta[resource.id] || {
            label: resource.name || resource.id,
            icon: 'Database',
            color: '#6b7280',
          }

          return (
            <a key={resource.id} href={resource.href} style={{ textDecoration: 'none' }}>
              <Box style={styles.card}>
                <Box style={{ ...styles.iconBox, background: meta.color }}>
                  <Icon icon={meta.icon} color="white" />
                </Box>
                <H2 style={{ margin: 0, color: '#111827' }}>{meta.label}</H2>
                <Text style={{ color: '#6b7280', marginTop: 6 }}>Open records</Text>
              </Box>
            </a>
          )
        })}
      </Box>

      <Box style={styles.panel}>
        <H2 style={{ marginTop: 0 }}>Common Workflows</H2>
        <Text style={{ color: '#6b7280' }}>
          Use these shortcuts for the admin tasks you will repeat most often.
        </Text>
        <Box style={styles.quickLinks}>
          <a href="/admin/resources/Food/actions/new" style={styles.link}>
            <Text fontWeight="bold">Create food item</Text>
            <Text color="grey60">Upload a photo, set price, and assign category.</Text>
          </a>
          <a href="/admin/resources/Category/actions/new" style={styles.link}>
            <Text fontWeight="bold">Add category</Text>
            <Text color="grey60">Create banners and menu groups.</Text>
          </a>
          <a href="/admin/resources/Order" style={styles.link}>
            <Text fontWeight="bold">Review orders</Text>
            <Text color="grey60">Track customer orders and statuses.</Text>
          </a>
          <a href="/admin/resources/DeliveryPerson/actions/new" style={styles.link}>
            <Text fontWeight="bold">Add courier</Text>
            <Text color="grey60">Manage delivery availability.</Text>
          </a>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
