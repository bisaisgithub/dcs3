
let inventoryAdd = [
  {
    _id: 1,
    add_id: '',
    supplier: 's1',
    invoice: 'inv1',
    date_received: 'd1',
    type: 'add',
    items:[
      {
        description: 'd1',
        quantity: 10
      },
      {
        description: 'd2',
        quantity: 10
      },
    ]
  }
]

let inventoryDeduct = [
  {
    _id: 1,
    add_id: 'ObjectId',
    appointment_id: 'ObjectId',
    // supplier: 's1',
    // invoice: 'inv1',
    // date_received: 'd1',
    // type: 'add',
    items:[
      {
        description: 'd1',
        quantity: 10
      },
      {
        description: 'd2',
        quantity: 10
      },
    ]
  }
]