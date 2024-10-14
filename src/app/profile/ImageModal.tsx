import React from 'react';
import Modal from 'react-modal';

//Modal.setAppElement('#root'); // This is important for accessibility

const ImageModal = ({ isOpen, onRequestClose, images }: { isOpen: boolean, onRequestClose: () => void, images: Array<{ url: string }> }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Image Gallery"
      className="modal"
      overlayClassName="overlay"
    >
      <button onClick={onRequestClose} className="close-button">Close</button>
      <div className="image-gallery">
        {images.map((image, index) => (
          <img key={index} src={image.url} alt={`Image ${index}`} className="gallery-image" />
        ))}
      </div>
    </Modal>
  );
};

export default ImageModal;
