import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { AiFillCamera, AiOutlineArrowLeft, AiOutlineShopping } from 'react-icons/ai';
import { FaPaintBrush, FaTshirt } from 'react-icons/fa';
import { useSnapshot } from 'valtio';
import FilePicker from './FilePicker';
import { state } from './store';

export function Overlay() {
   const snap = useSnapshot(state);
   const transition = { type: 'spring', duration: 0.8 };
   const config = {
      initial: { x: -100, opacity: 0, transition: { ...transition, delay: 0.5 } },
      animate: { x: 0, opacity: 1, transition: { ...transition, delay: 0 } },
      exit: { x: -100, opacity: 0, transition: { ...transition, delay: 0 } },
   };
   return (
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
         <motion.header
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}>
            <FaTshirt size='3em' />
            <motion.div
               animate={{ x: snap.intro ? 0 : 100, opacity: snap.intro ? 1 : 0 }}
               transition={transition}>
               <AiOutlineShopping size='3em' />
            </motion.div>
         </motion.header>
         <AnimatePresence>
            {snap.intro ? (
               <motion.section key='main' {...config}>
                  <div className='section--container'>
                     <motion.div
                        key='title'
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                           type: 'spring',
                           damping: 5,
                           stiffness: 40,
                           restDelta: 0.001,
                           duration: 0.3,
                        }}>
                        <h1>{'Tee Rific'}</h1>
                     </motion.div>
                     <div className='support--content'>
                        <motion.div
                           key='p'
                           initial={{ y: 100, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{
                              type: 'spring',
                              damping: 7,
                              stiffness: 30,
                              restDelta: 0.001,
                              duration: 0.6,
                              delay: 0.2,
                              delayChildren: 0.2,
                           }}>
                           <p>
                              Create your unique T-shirt with this 3D customization tool.{' '}
                              <strong>Unleash your imagination</strong> and define your own style.
                           </p>
                           <button
                              style={{ background: snap.color }}
                              onClick={() => (state.intro = false)}>
                              CUSTOMIZE IT <FaPaintBrush size='1.3em' />
                           </button>
                        </motion.div>
                     </div>
                  </div>
               </motion.section>
            ) : (
               <motion.section key='custom' {...config}>
                  <Customizer />
               </motion.section>
            )}
         </AnimatePresence>
      </div>
   );
}

function Customizer() {
   const snap = useSnapshot(state);
   const [file, setFile] = useState('');

   const handleColorPickerChange = color => {
      state.color = color.hex;
   };

   const handleScaleChange = e => {
      state.scale = e.target.value;
   };

   const reader = file => {
      return new Promise((resolve, reject) => {
         if (!(file instanceof Blob)) {
            reject(new Error('Parameter is not a Blob.'));
            return;
         }

         const fileReader = new FileReader();
         fileReader.onload = () => resolve(fileReader.result);
         fileReader.onerror = () => reject(fileReader.error);
         fileReader.readAsDataURL(file);
      });
   };

   const readFile = () => {
      reader(file).then(result => {
         state.decal = result;
      });
   };

   return (
      <div className='customizer'>
         <div className='color-options'>
            {!snap.colorPicker &&
               snap.colors.map(color => (
                  <div
                     key={color}
                     className={`circle`}
                     style={{ background: color }}
                     onClick={() => (state.color = color)}></div>
               ))}
            <div
               className={`circle`}
               style={{
                  background:
                     'conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red)',
               }}
               onClick={() => (state.colorPicker = !state.colorPicker)}></div>
         </div>

         {snap.colorPicker && (
            <ChromePicker
               disableAlpha={true}
               color={snap.color}
               onChange={handleColorPickerChange}
            />
         )}

         <input
            type='range'
            min='0'
            max='1'
            value={snap.scale}
            step='0.01'
            onChange={handleScaleChange}
         />

         <div className='decals'>
            <div className='decals--container'>
               {snap.decals.map(decal => (
                  <div key={decal} className={`decal`} onClick={() => (state.decal = decal)}>
                     <img src={decal} alt='brand' />
                  </div>
               ))}
            </div>
            <FilePicker file={file} setFile={setFile} readFile={readFile} style />
         </div>

         <button
            className='share'
            onClick={() => {
               const link = document.createElement('a');
               link.setAttribute('download', 'canvas.png');
               link.setAttribute(
                  'href',
                  document
                     .querySelector('canvas')
                     .toDataURL('image/png')
                     .replace('image/png', 'image/octet-stream')
               );
               link.click();
            }}>
            DOWNLOAD
            <AiFillCamera size='1.3em' />
         </button>

         <button className='exit' onClick={() => (state.intro = true)}>
            GO BACK
            <AiOutlineArrowLeft size='1.3em' />
         </button>
      </div>
   );
}
