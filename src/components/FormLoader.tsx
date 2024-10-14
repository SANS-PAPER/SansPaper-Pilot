import React from 'react';
import ContentLoader from 'react-content-loader';
//import './FormLoader.css'; 
import { Color } from '@/GlobalStyles'; // Adjust based on how you handle styles

function MyLoader(props:any) {
  const width = window.innerWidth - 10; // Use window object for dimensions
  return (
    <div className="loader">
      <ContentLoader
        width={width}
        height={84}
        backgroundColor={Color.colorGainsboro_100}
        foregroundColor={Color.lightGray}
        {...props}
      >
        <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
        <rect x="76" y="0" rx="3" ry="3" width={width - 150} height="11" />
        <rect x="80" y="48" rx="3" ry="3" width="100" height="11" />
        <rect x="61" y="48" rx="3" ry="3" width="72" height="11" />
        <rect x="18" y="48" rx="3" ry="3" width={width - 100} height="11" />
        <rect x="0" y="71" rx="3" ry="3" width="80" height="11" />
        <rect x="18" y="23" rx="3" ry="3" width="60" height="11" />
        <rect x="30" y="23" rx="3" ry="3" width="90" height="11" />
      </ContentLoader>
    </div>
  );
}

const ToFixHeight: React.ReactNode[] = [];

// Adjust the loop logic to be responsive to window height
for (let i = 0; i < (window.innerHeight - 250) / 100; i++) {
  ToFixHeight.push(<MyLoader key={i} />);
}

function FormLoader() {
  return (
    <div className="formLoader">
      {ToFixHeight}
    </div>
  );
}

// Styles using CSS (FormLoader.css)

/*
.formLoader {
  width: 100%;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}

.loader {
  margin-bottom: 30px;
}
*/

export default FormLoader;
