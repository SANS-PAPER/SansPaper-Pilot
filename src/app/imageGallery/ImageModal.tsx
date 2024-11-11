"use client";
import { FC, useEffect, useState } from "react";
import Modal from 'react-modal';

//Modal.setAppElement('#root'); // This is important for accessibility

const ImageModal = ({ isOpen, onRequestClose, images }: { isOpen: boolean, onRequestClose: () => void, images: { src: string; width: number; height: number; thumbnailCaption: any; caption: any; } }) => {

  const [formData, setFormData] = useState<any>([]);

  if (images){
    console.log(images);
    console.log('Get fillupform text only data');
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Image Gallery"
      className="modal"
      overlayClassName="overlay"
    >
      <button onClick={onRequestClose} className="close-button">Close</button>
      <div className="grid">
        <img key={images.thumbnailCaption} src={images.src} alt={`Image ${images.thumbnailCaption}`} className="gallery-image" />
        <div className="caption">
          <p>{images.caption}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
