import React from 'react';
export default function LoadImage( {path, size} ) {
    return (
        <img src = {`http://localhost:8000/uploads/${path}`} alt = "" className = "Avatar"
            style={{width: size ? size : "auto", height: size ? size : "auto", borderRadius: "50%"}}
        />
    )
}