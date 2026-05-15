export async function fetchAddresses() {
  return Promise.resolve([
    { id: 1, street: 'Amir Temur ko\'chasi, 12', city: 'Toshkent' },
    { id: 2, street: 'Mustaqillik shoh ko\'chasi, 45', city: 'Toshkent' }
  ])
}

export async function saveAddress(payload) {
  console.log('Mock Address Saved:', payload)
  return Promise.resolve({ success: true })
}

export async function detectLocation() {
  return Promise.resolve({
    city: 'Toshkent',
    region: 'Toshkent shahri',
    address: 'Chilonzor, 9-kvartal'
  })
}
