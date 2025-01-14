// ToastNotification.js
import React from 'react';
import Toast from 'react-native-toast-message';

const ToastNotification = ({ type, text1, text2, position, visibilityTime }) => {
    // The component's content remains the same, no need to change much
    return (
        <>
            <Toast
                ref={(ref) => Toast.setRef(ref)}
                config={{
                    success: { backgroundColor: 'green', textColor: 'white' },
                    error: { backgroundColor: 'red', textColor: 'white' },
                    info: { backgroundColor: 'blue', textColor: 'white' },
                }}
            />
            {type && (
                Toast.show({
                    type,
                    position: position || 'bottom',
                    text1: text1 || 'Toast Message',
                    text2: text2 || 'Details here...',
                    visibilityTime: visibilityTime || 2000,
                    autoHide: true,
                })
            )}
        </>
    );
};

// Add default props here
ToastNotification.defaultProps = {
    type: 'success', // Default type if not passed
    text1: 'Toast Message', // Default message if not passed
    text2: 'Details here...', // Default additional details
    position: 'bottom', // Default position
    visibilityTime: 2000, // Default visibility time (2 seconds)
};

export default ToastNotification;
