import React, { useEffect, useState } from 'react'
import { ApiClient, Box, Button, H1, H2, Icon, Text } from 'adminjs'
import { useSelector } from 'react-redux'

const api = new ApiClient()

const resourceMeta = {
  User: { label: 'Customers', icon: 'User', color: '#2563eb' },
  Food: { label: 'Foods', icon: 'ShoppingBag', color: '#f97316' },
  Seller: { label: 'Sellers', icon: 'Store', color: '#16a34a' },
  Order: { label: 'Orders', icon: 'ShoppingCart', color: '#9333ea' },
  DeliveryPerson: { label: 'Couriers', icon: 'Truck', color: '#0891b2' },
  Category: { label: 'Categories', icon: 'Grid', color: '#dc2626' },
  Address: { label: 'Addresses', icon: 'MapPin', color: '#4b5563' },
}

const formatPrice = (value = 0) =>
  `${Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`

const styles = {
  page: { minHeight: '100%', background: '#f6f7fb', padding: 32 },
  hero: {
    background: 'linear-gradient(135deg, #111827 0%, #1f2937 55%, #f97316 100%)',
    borderRadius: 14,
    color: '#fff',
    padding: 34,
    marginBottom: 24,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: 24,
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: 18,
    boxShadow: '0 14px 34px rgba(17, 24, 39, 0.07)',
  },
  panel: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: 22,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
  },
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalOrders: 0,
    revenue: 0,
    popularFoods: [],
    latestOrders: [],
  })

  const resourcesState = useSelector((state) => state.resources || [])
  const resources = Array.isArray(resourcesState)
    ? resourcesState
    : Object.values(resourcesState || {})
  const visibleResources = resources.filter((resource) => resource?.href)

  useEffect(() => {
    api.getDashboard().then((response) => {
      setStats(response.data || {})
    })
  }, [])

  return (
    <Box style={styles.page}>
      <Box style={styles.hero}>
        <Box>
          <Text style={{ color: '#fed7aa', fontWeight: 800, marginBottom: 8 }}>
            Food Dash Operations
          </Text>
          <H1 style={{ color: '#fff', margin: 0 }}>Admin Control Center</H1>
          <Text style={{ color: '#f3f4f6', maxWidth: 620, marginTop: 12 }}>
            Track menu health, orders, revenue, and catalog activity from one focused workspace.
          </Text>
        </Box>
        <Box style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button as="a" href="/admin/resources/Food/actions/new" variant="primary">Add food</Button>
          <Button as="a" href="/admin/resources/Order" variant="light">View orders</Button>
        </Box>
      </Box>

      <Box style={styles.grid}>
        {[
          ['Total foods', stats.totalFoods, 'ShoppingBag', '#f97316'],
          ['Total orders', stats.totalOrders, 'ShoppingCart', '#9333ea'],
          ['Revenue', formatPrice(stats.revenue), 'DollarSign', '#16a34a'],
          ['Popular foods', stats.popularFoods?.length || 0, 'Star', '#0891b2'],
        ].map(([label, value, icon, color]) => (
          <Box key={label} style={styles.card}>
            <Box style={{ width: 42, height: 42, borderRadius: 10, display: 'grid', placeItems: 'center', background: color, color: '#fff', marginBottom: 14 }}>
              <Icon icon={icon} color="white" />
            </Box>
            <Text style={{ color: '#64748b', fontWeight: 700 }}>{label}</Text>
            <H2 style={{ margin: 0, color: '#111827' }}>{value}</H2>
          </Box>
        ))}
      </Box>

      <Box style={{ ...styles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Box style={styles.panel}>
          <H2 style={{ marginTop: 0 }}>Popular foods</H2>
          {(stats.popularFoods || []).map((food) => (
            <Box key={food.name} style={styles.row}>
              <Text fontWeight="bold">{food.name}</Text>
              <Text color="grey60">{formatPrice(food.price)}</Text>
            </Box>
          ))}
        </Box>

        <Box style={styles.panel}>
          <H2 style={{ marginTop: 0 }}>Latest orders</H2>
          {(stats.latestOrders || []).map((order) => (
            <Box key={order.id} style={styles.row}>
              <Box>
                <Text fontWeight="bold">#{order.id}</Text>
                <Text color="grey60">{order.status}</Text>
              </Box>
              <Text fontWeight="bold">{formatPrice(order.totalPrice)}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      <Box style={styles.grid}>
        {visibleResources.map((resource) => {
          const meta = resourceMeta[resource.id] || { label: resource.name || resource.id, icon: 'Database', color: '#6b7280' }
          return (
            <a key={resource.id} href={resource.href} style={{ textDecoration: 'none' }}>
              <Box style={styles.card}>
                <Box style={{ width: 42, height: 42, borderRadius: 10, display: 'grid', placeItems: 'center', background: meta.color, marginBottom: 14 }}>
                  <Icon icon={meta.icon} color="white" />
                </Box>
                <H2 style={{ margin: 0, color: '#111827' }}>{meta.label}</H2>
                <Text style={{ color: '#6b7280', marginTop: 6 }}>Open records</Text>
              </Box>
            </a>
          )
        })}
      </Box>
    </Box>
  )
}

export default Dashboard
