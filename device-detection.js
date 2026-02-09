// Device Detection and Download Control
// This script detects the user's device and shows appropriate installation flow
// APK + OBB files are hosted on Google Drive (too large for GitHub)

// ============================================
// CONFIGURATION - UPDATE THIS LINK
// ============================================
const GOOGLE_DRIVE_LINK = 'https://drive.google.com/drive/folders/1lZLI30QeExp-tq166q50ZQWte7b0mSQ4?usp=sharing';
// Replace YOUR_FOLDER_ID_HERE with your actual Google Drive folder ID
// Example: https://drive.google.com/drive/folders/1ABC123xyz?usp=sharing
// ============================================

// Function to detect the user's device
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Detect Android
  if (/android/i.test(userAgent)) {
    return {
      type: 'Android',
      isAndroid: true,
      icon: '🤖',
      message: 'Your Android device is compatible! Scan the QR code or click the link below to download from Google Drive.'
    };
  }
  
  // Detect iOS (iPhone, iPad, iPod)
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return {
      type: 'iOS',
      isAndroid: false,
      icon: '🍎',
      message: 'Sorry, KATIPUDROID is currently only available for Android devices. iOS version is not available at this time.'
    };
  }
  
  // Detect Windows
  if (/Windows/i.test(userAgent)) {
    return {
      type: 'Windows PC',
      isAndroid: false,
      icon: '💻',
      message: 'KATIPUDROID is an Android-exclusive mobile game. It cannot be installed on Windows computers.'
    };
  }
  
  // Detect Mac
  if (/Mac/i.test(userAgent)) {
    return {
      type: 'Mac',
      isAndroid: false,
      icon: '🖥️',
      message: 'KATIPUDROID is an Android-exclusive mobile game. It cannot be installed on Mac computers.'
    };
  }
  
  // Detect Linux
  if (/Linux/i.test(userAgent) && !/android/i.test(userAgent)) {
    return {
      type: 'Linux PC',
      isAndroid: false,
      icon: '🐧',
      message: 'KATIPUDROID is an Android-exclusive mobile game. It cannot be installed on Linux computers.'
    };
  }
  
  // Unknown device
  return {
    type: 'Unknown Device',
    isAndroid: false,
    icon: '❓',
    message: 'We could not detect your device type. KATIPUDROID is only available for Android devices.'
  };
}

// Function to show popup based on device type
function showDevicePopup(deviceInfo) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('device-popup-overlay');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  let popupContent;
  
  if (deviceInfo.isAndroid) {
    // Android device - show QR code and installation instructions
    popupContent = createAndroidPopup(deviceInfo);
  } else {
    // Non-Android device - show "not available" message
    popupContent = createNonAndroidPopup(deviceInfo);
  }
  
  // Add popup to body
  document.body.insertAdjacentHTML('beforeend', popupContent);
  
  // Generate QR code for all users (Android gets it for download, others for sharing)
  setTimeout(() => generateQRCode(), 100);
  
  // Prevent body scroll when popup is open
  document.body.style.overflow = 'hidden';
}

// Create popup content for Android devices
function createAndroidPopup(deviceInfo) {
  return `
    <div id="device-popup-overlay" class="device-popup-overlay show">
      <div class="device-popup device-popup-large">
        <button class="popup-close" onclick="closeDevicePopup()">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="popup-icon success">
          ${deviceInfo.icon}
        </div>
        
        <h2 class="popup-title">
          <i class="fas fa-check-circle"></i> Android Device Detected!
        </h2>
        
        <p class="popup-message">
          ${deviceInfo.message}
        </p>
        
        <!-- QR Code Section -->
        <div class="qr-section">
          <h3><i class="fas fa-qrcode"></i> Scan QR Code to Download</h3>
          <div class="qr-container" id="qrcode-container">
            <div id="qrcode"></div>
          </div>
          <p class="qr-hint">Point your camera at this QR code</p>
        </div>
        
        <!-- OR Divider -->
        <div class="divider">
          <span>OR</span>
        </div>
        
        <!-- Direct Link -->
        <div class="direct-link-section">
          <a href="${GOOGLE_DRIVE_LINK}" target="_blank" class="popup-btn popup-btn-primary popup-btn-large">
            <i class="fab fa-google-drive"></i>
            Open Google Drive
          </a>
        </div>
        
        <!-- Installation Instructions -->
        <div class="install-instructions">
          <h3><i class="fas fa-list-ol"></i> Installation Steps</h3>
          <ol>
            <li>
              <strong>Download Files:</strong>
              <span>Download both the <code>katipudroid.apk</code> and <code>main.obb</code> files from Google Drive</span>
            </li>
            <li>
              <strong>Enable Unknown Sources:</strong>
              <span>Go to <em>Settings → Security → Install Unknown Apps</em> and enable for your browser/file manager</span>
            </li>
            <li>
              <strong>Install APK:</strong>
              <span>Open the downloaded <code>.apk</code> file and tap <em>Install</em></span>
            </li>
            <li>
              <strong>Copy OBB File:</strong>
              <span>Copy <code>main.obb</code> to <code>Android/obb/com.katipudroid.game/</code></span>
              <br><small>(Create the folder if it doesn't exist)</small>
            </li>
            <li>
              <strong>Launch Game:</strong>
              <span>Open KATIPUDROID from your app drawer and enjoy!</span>
            </li>
          </ol>
        </div>
        
        <!-- Warning -->
        <div class="install-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <span>The game requires approximately <strong>2GB</strong> of storage space. Make sure you have enough free space before downloading.</span>
        </div>
        
        <div class="popup-buttons">
          <button class="popup-btn popup-btn-secondary" onclick="closeDevicePopup()">
            <i class="fas fa-times"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}

// Create popup content for non-Android devices
function createNonAndroidPopup(deviceInfo) {
  return `
    <div id="device-popup-overlay" class="device-popup-overlay show">
      <div class="device-popup">
        <button class="popup-close" onclick="closeDevicePopup()">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="popup-icon error">
          ${deviceInfo.icon}
        </div>
        
        <h2 class="popup-title">
          <i class="fas fa-mobile-alt"></i> Android Only
        </h2>
        
        <p class="popup-message">
          ${deviceInfo.message}
        </p>
        
        <div class="device-info">
          <p><strong>Your Device:</strong> ${deviceInfo.type}</p>
          <p><strong>Status:</strong> <span class="status-not-compatible">❌ Not Compatible</span></p>
        </div>
        
        <div class="alternative-section">
          <h3><i class="fas fa-lightbulb"></i> What You Can Do</h3>
          <ul class="alternative-list">
            <li>
              <i class="fas fa-mobile-alt"></i>
              <span>Open this website on your <strong>Android phone or tablet</strong></span>
            </li>
            <li>
              <i class="fas fa-qrcode"></i>
              <span>Scan the QR code below with your Android device</span>
            </li>
            <li>
              <i class="fas fa-share-alt"></i>
              <span>Share this page link with someone who has an Android device</span>
            </li>
          </ul>
        </div>
        
        <!-- QR Code for sharing -->
        <div class="qr-section qr-section-small">
          <h4><i class="fas fa-qrcode"></i> Scan with Android Phone</h4>
          <div class="qr-container qr-container-small" id="qrcode-container">
            <div id="qrcode"></div>
          </div>
          <p class="qr-hint">This QR code links to the Google Drive download</p>
        </div>
        
        <div class="popup-buttons">
          <button class="popup-btn popup-btn-primary" onclick="copyDownloadLink()">
            <i class="fas fa-copy"></i>
            Copy Download Link
          </button>
          <button class="popup-btn popup-btn-secondary" onclick="closeDevicePopup()">
            <i class="fas fa-times"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}

// Generate QR Code using qrcodejs library
function generateQRCode() {
  const qrcodeContainer = document.getElementById('qrcode');
  if (!qrcodeContainer) return;
  
  // Clear any existing content
  qrcodeContainer.innerHTML = '';
  
  if (typeof QRCode !== 'undefined') {
    new QRCode(qrcodeContainer, {
      text: GOOGLE_DRIVE_LINK,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    // Show loading state and dynamically load library
    qrcodeContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #666;">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
        <p style="margin-top: 10px;">Loading QR Code...</p>
      </div>
    `;
    
    // Dynamically load QRCode library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = function() {
      qrcodeContainer.innerHTML = '';
      new QRCode(qrcodeContainer, {
        text: GOOGLE_DRIVE_LINK,
        width: 180,
        height: 180,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    };
    script.onerror = function() {
      qrcodeContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #ff4655;">
          <i class="fas fa-exclamation-triangle fa-2x"></i>
          <p style="margin-top: 10px;">Failed to load QR code</p>
          <a href="${GOOGLE_DRIVE_LINK}" target="_blank" style="color: #ff4655;">Click here instead</a>
        </div>
      `;
    };
    document.head.appendChild(script);
  }
}

// Copy download link to clipboard
function copyDownloadLink() {
  navigator.clipboard.writeText(GOOGLE_DRIVE_LINK).then(() => {
    showToast('✅ Download link copied to clipboard!');
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = GOOGLE_DRIVE_LINK;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('✅ Download link copied to clipboard!');
    } catch (err) {
      showToast('❌ Failed to copy link');
    }
    document.body.removeChild(textArea);
  });
}

// Show toast notification
function showToast(message) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Function to close popup
function closeDevicePopup() {
  const popup = document.getElementById('device-popup-overlay');
  if (popup) {
    popup.classList.remove('show');
    setTimeout(() => {
      popup.remove();
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

// Function to handle download/install button click
function handleDownloadClick(event) {
  event.preventDefault();
  
  console.log('🎮 Install button clicked');
  
  // Detect device
  const deviceInfo = detectDevice();
  console.log('📱 Detected device:', deviceInfo);
  
  // Show appropriate popup
  showDevicePopup(deviceInfo);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 Device detection initialized');
  console.log('📦 Google Drive Link:', GOOGLE_DRIVE_LINK);
  
  // Get the install button (try multiple selectors)
  const installBtn = document.getElementById('download-btn') || 
                     document.getElementById('install-btn') ||
                     document.querySelector('.learn-btn') ||
                     document.querySelector('a[href*="katipudroid.apk"]');
  
  if (installBtn) {
    // Remove any existing href to prevent direct download
    if (installBtn.hasAttribute('href')) {
      installBtn.removeAttribute('href');
      installBtn.style.cursor = 'pointer';
    }
    
    // Add click event listener
    installBtn.addEventListener('click', handleDownloadClick);
    console.log('✅ Install button listener added');
  } else {
    console.log('ℹ️ Install button not found on this page');
  }
});

// Close popup when clicking outside
document.addEventListener('click', function(event) {
  const popup = document.getElementById('device-popup-overlay');
  if (popup && event.target === popup) {
    closeDevicePopup();
  }
});

// Close popup with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeDevicePopup();
  }
});

// Make functions globally available
window.closeDevicePopup = closeDevicePopup;
window.copyDownloadLink = copyDownloadLink;
window.handleDownloadClick = handleDownloadClick;

// Log device info on page load (for debugging)
console.log('🔍 User Agent:', navigator.userAgent);
console.log('📱 Device Info:', detectDevice());