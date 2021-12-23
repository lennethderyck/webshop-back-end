const data = {
  paintings: [
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
      name: 'Thinking',
      type: 'Canvas',
      price: 999.00,
      description: 'Test om een schilderij toe te voegen.',
      img: 'img/Fabric14.jpg',
      size: '80x80',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
      name: 'Fragile',
      type: 'Textile',
      price: 999.99,
      description: 'Dit is een prachtig werk van Noëlla Nechelput.',
      img: 'img/Fabric34.jpg',
      size: '80x100',
    },
  ],

  users: [
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
      lastName: 'De Ryck',
      firstName: 'Lenneth',
      password: 'admin123',
      isAdmin: true,
    },
  ]};

module.exports = { data };
