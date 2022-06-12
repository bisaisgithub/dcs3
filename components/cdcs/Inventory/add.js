
let inventoryAdd = [
  {
    _id: 1,
    supplier: 's1',
    invoice: 'inv1',
    date: 'd1',
    status: 'add',
    items:[
      {
        name: 'd1',
        qty: 10,
        unit_cost: 100,
        received: 10,
        remaining: 10
      },
      {
        name: 'd2',
        qty: 10,
        unit_cost: 200,
        remaining: 0
      },
    ],
    deduct_id: []
  }
]

// let inventories: [{name: String, code: String, qty: Number}],

let inventoryDeduct = [
  {
    name: 'd1',
    code: '1',
    qty: 5
  }
]