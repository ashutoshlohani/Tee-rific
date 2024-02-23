import { useRef } from 'react';
import { FaPaintBrush } from 'react-icons/fa';
import { useSnapshot } from 'valtio';
import { state } from './store';

const FilePicker = ({ file, setFile, readFile }) => {
   const snap = useSnapshot(state);
   const fileInputRef = useRef(null);

   const handleFileInputChange = e => {
      setFile(e.target.files[0]);
   };

   const handleButtonClick = () => {
      fileInputRef.current.click();
      readFile();
   };

   const truncateFileName = file => {
      const words = file.slice(0, 10);
      return `${words}...`;
   };

   return (
      <div className='filepicker-container'>
         <div className='flex-1 flex flex-col'>
            <input
               ref={fileInputRef}
               id='file-upload'
               type='file'
               accept='image/*'
               onChange={handleFileInputChange}
               style={{ display: 'none' }}
            />

            <button id='file-upload-btn' className='uploadButton' onClick={handleButtonClick}>
               {file === '' ? 'Upload Image' : truncateFileName(file.name)}
            </button>
         </div>

         <div className='mt-4 flex flex-wrap gap-3'>
            <button
               disabled={file === ''}
               className='uploadButton'
               style={{ backgroundColor: snap.color }}
               onClick={() => readFile()}>
               <FaPaintBrush size='1.2em' />
            </button>
         </div>
      </div>
   );
};

export default FilePicker;
