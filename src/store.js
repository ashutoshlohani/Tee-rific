import { proxy } from 'valtio';

const state = proxy({
   intro: true,
   colors: ['#ccc', '#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934'],
   decals: ['/react.png', '/three2.png', '/pmndrs.png', './pngegg.png'],
   color: '#4EA6EF',
   decal: './react.png',
   colorPicker: false,
   scale: 0.2,
});

export { state };
