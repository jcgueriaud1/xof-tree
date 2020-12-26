/** [
  {
    'repeat(5, 30)': {
      expanded: '{{bool()}}',
      itemdata: '{{surname()}}',

      children: [
        {
          'repeat(10,20)': {
            expanded: '{{bool()}}',
      		itemdata: '{{surname()}}',
             children: [
              {
                'repeat(5)': {
                  itemdata: '{{surname()}}',
                }
              }
            ]
          }
        }
      ]
    }
  }
] **/

export default {
  DATA: [
    {
      expanded: false,
      itemdata: 'Glenn',
      children: [
        {
          expanded: false,
          itemdata: 'Morrow',
          children: [
            {
              itemdata: 'Odonnell',
            },
            {
              itemdata: 'Solis',
            },
            {
              itemdata: 'Hansen',
            },
            {
              itemdata: 'Galloway',
            },
            {
              itemdata: 'Willis',
            },
          ],
        },
      ],
    },
  ],
};
