import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";

const QRCodeScanner = ({ isDarkMode, onScanSuccess, onScanError }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const qrScannerRef = useRef(null);

  const handleScanSuccess = (decodedText, decodedResult) => {
    onScanSuccess(decodedText, decodedResult);
    closeScanner();
  };

  const handleScanError = (error) => {
    if (onScanError) onScanError(error);
  };

  const openScanner = () => {
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  useEffect(() => {
    if (isScannerOpen) {
      qrScannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      qrScannerRef.current.render(handleScanSuccess, handleScanError);
    } else if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScannerOpen]);

  return (
    <div>
      <button className="btn-logo me-2 fw-bold" onClick={openScanner}>
        {isDarkMode ? (
          <i
            className="bi bi-qr-code-scan text-logo"
            style={{ color: "white" }}
          ></i>
        ) : (
          <i
            className="bi bi-qr-code-scan text-logo"
            style={{ color: "black" }}
          ></i>
        )}
      </button>
      {isScannerOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="qrScannerModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="qrScannerModalLabel">Scan QR Code</h5>
                <button type="button" className="btn-close" onClick={closeScanner} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div id="qr-reader" style={{ width: '100%' }}></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeScanner}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
