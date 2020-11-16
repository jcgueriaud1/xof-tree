/** [
  {
    'repeat(5, 30)': {
      expanded: '{{bool()}}',
      name: '{{surname()}}',

      children: [
        {
          'repeat(10,20)': {
            expanded: '{{bool()}}',
      		name: '{{surname()}}',
             children: [
              {
                'repeat(5)': {
                  name: '{{surname()}}',
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
      name: 'Glenn',
      children: [
        {
          expanded: false,
          name: 'Morrow',
          children: [
            {
              name: 'Odonnell',
            },
            {
              name: 'Solis',
            },
            {
              name: 'Hansen',
            },
            {
              name: 'Galloway',
            },
            {
              name: 'Willis',
            },
          ],
        },
      ],
    },
  ],
};
