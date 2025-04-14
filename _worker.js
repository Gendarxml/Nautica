<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Config Generator</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      text-align: center;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #45a049;
    }
    .result {
      margin-top: 20px;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 4px;
      border-left: 4px solid #4CAF50;
      word-break: break-all;
    }
    .tab {
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
      border-radius: 4px 4px 0 0;
    }
    .tab button {
      background-color: inherit;
      float: left;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 10px 16px;
      transition: 0.3s;
      color: black;
    }
    .tab button:hover {
      background-color: #ddd;
    }
    .tab button.active {
      background-color: #4CAF50;
      color: white;
    }
    .tabcontent {
      display: none;
      padding: 20px;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0 0 4px 4px;
      background-color: white;
    }
    .copy-btn {
      background-color: #2196F3;
      margin-top: 10px;
    }
    .copy-btn:hover {
      background-color: #0b7dda;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Config Generator</h1>
    
    <div class="tab">
      <button class="tablinks active" onclick="openTab(event, 'vmess')">VMess</button>
      <button class="tablinks" onclick="openTab(event, 'vless')">VLess</button>
      <button class="tablinks" onclick="openTab(event, 'trojan')">Trojan</button>
      <button class="tablinks" onclick="openTab(event, 'ss')">Shadowsocks</button>
    </div>
    
    <div id="vmess" class="tabcontent" style="display: block;">
      <div class="form-group">
        <label for="vmess-address">Address/Server:</label>
        <input type="text" id="vmess-address" placeholder="example.com">
      </div>
      <div class="form-group">
        <label for="vmess-port">Port:</label>
        <input type="number" id="vmess-port" placeholder="443" value="443">
      </div>
      <div class="form-group">
        <label for="vmess-id">User ID/UUID:</label>
        <input type="text" id="vmess-id" placeholder="Generated UUID">
      </div>
      <div class="form-group">
        <label for="vmess-security">Security:</label>
        <select id="vmess-security">
          <option value="auto">auto</option>
          <option value="aes-128-gcm">aes-128-gcm</option>
          <option value="chacha20-poly1305">chacha20-poly1305</option>
          <option value="none">none</option>
        </select>
      </div>
      <div class="form-group">
        <label for="vmess-network">Network:</label>
        <select id="vmess-network">
          <option value="tcp">tcp</option>
          <option value="ws" selected>ws (WebSocket)</option>
          <option value="h2">h2</option>
          <option value="grpc">gRPC</option>
        </select>
      </div>
      <div class="form-group" id="vmess-path-group">
        <label for="vmess-path">Path:</label>
        <input type="text" id="vmess-path" placeholder="/path" value="/id">
      </div>
      <div class="form-group" id="vmess-host-group">
        <label for="vmess-host">Host/SNI:</label>
        <input type="text" id="vmess-host" placeholder="example.com">
      </div>
      <div class="form-group">
        <label for="vmess-tls">TLS:</label>
        <select id="vmess-tls">
          <option value="tls">TLS</option>
          <option value="none">None</option>
        </select>
      </div>
      <button onclick="generateVMess()">Generate VMess Link</button>
      <button class="copy-btn" onclick="copyToClipboard('vmess-result')">Copy Link</button>
      <div class="result" id="vmess-result"></div>
    </div>
    
    <div id="vless" class="tabcontent">
      <div class="form-group">
        <label for="vless-address">Address/Server:</label>
        <input type="text" id="vless-address" placeholder="example.com">
      </div>
      <div class="form-group">
        <label for="vless-port">Port:</label>
        <input type="number" id="vless-port" placeholder="443" value="443">
      </div>
      <div class="form-group">
        <label for="vless-id">User ID/UUID:</label>
        <input type="text" id="vless-id" placeholder="Generated UUID">
      </div>
      <div class="form-group">
        <label for="vless-network">Network:</label>
        <select id="vless-network">
          <option value="tcp">tcp</option>
          <option value="ws" selected>ws (WebSocket)</option>
          <option value="grpc">gRPC</option>
        </select>
      </div>
      <div class="form-group" id="vless-path-group">
        <label for="vless-path">Path:</label>
        <input type="text" id="vless-path" placeholder="/path" value="/id">
      </div>
      <div class="form-group" id="vless-host-group">
        <label for="vless-host">Host/SNI:</label>
        <input type="text" id="vless-host" placeholder="example.com">
      </div>
      <div class="form-group">
        <label for="vless-tls">TLS:</label>
        <select id="vless-tls">
          <option value="tls">TLS</option>
          <option value="none">None</option>
        </select>
      </div>
      <button onclick="generateVLess()">Generate VLess Link</button>
      <button class="copy-btn" onclick="copyToClipboard('vless-result')">Copy Link</button>
      <div class="result" id="vless-result"></div>
    </div>
    
    <div id="trojan" class="tabcontent">
      <div class="form-group">
        <label for="trojan-address">Address/Server:</label>
        <input type="text" id="trojan-address" placeholder="example.com">
      </div>
      <div class="form-group">
        <label for="trojan-port">Port:</label>
        <input type="number" id="trojan-port" placeholder="443" value="443">
      </div>
      <div class="form-group">
        <label for="trojan-password">Password:</label>
        <input type="text" id="trojan-password" placeholder="Password">
      </div>
      <div class="form-group">
        <label for="trojan-network">Network:</label>
        <select id="trojan-network">
          <option value="tcp">tcp</option>
          <option value="ws" selected>ws (WebSocket)</option>
          <option value="grpc">gRPC</option>
        </select>
      </div>
      <div class="form-group" id="trojan-path-group">
        <label for="trojan-path">Path:</label>
        <input type="text" id="trojan-path" placeholder="/path" value="/id">
      </div>
      <div class="form-group" id="trojan-host-group">
        <label for="trojan-host">Host/SNI:</label>
        <input type="text" id="trojan-host" placeholder="example.com">
      </div>
      <button onclick="generateTrojan()">Generate Trojan Link</button>
      <button class="copy-btn" onclick="copyToClipboard('trojan-result')">Copy Link</button>
      <div class="result" id="trojan-result"></div>
    </div>
    
    <div id="ss" class="tabcontent">
      <div class="form-group">
        <label for="ss-address">Address/Server:</label>
        <input type="text" id="ss-address" placeholder="example.com">
      </div>
      <div class="form-group">
        <label for="ss-port">Port:</label>
        <input type="number" id="ss-port" placeholder="443" value="443">
      </div>
      <div class="form-group">
        <label for="ss-password">Password:</label>
        <input type="text" id="ss-password" placeholder="Password">
      </div>
      <div class="form-group">
        <label for="ss-method">Encryption Method:</label>
        <select id="ss-method">
          <option value="aes-256-gcm">aes-256-gcm</option>
          <option value="aes-128-gcm">aes-128-gcm</option>
          <option value="chacha20-poly1305">chacha20-poly1305</option>
          <option value="chacha20-ietf-poly1305">chacha20-ietf-poly1305</option>
        </select>
      </div>
      <div class="form-group">
        <label for="ss-plugin">Plugin:</label>
        <select id="ss-plugin">
          <option value="none">None</option>
          <option value="v2ray-plugin">v2ray-plugin</option>
        </select>
      </div>
      <div class="form-group" id="ss-plugin-options" style="display: none;">
        <label for="ss-path">Path:</label>
        <input type="text" id="ss-path" placeholder="/path" value="/id">
        <label for="ss-host">Host:</label>
        <input type="text" id="ss-host" placeholder="example.com">
        <label for="ss-tls">TLS:</label>
        <select id="ss-tls">
          <option value="tls">TLS</option>
          <option value="none">None</option>
        </select>
      </div>
      <button onclick="generateSS()">Generate Shadowsocks Link</button>
      <button class="copy-btn" onclick="copyToClipboard('ss-result')">Copy Link</button>
      <div class="result" id="ss-result"></div>
    </div>
  </div>

  <script>
    // Tab functionality
    function openTab(evt, tabName) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.className += " active";
      
      // Show/hide path and host fields based on network type
      updateNetworkFields(tabName);
    }
    
    // Update network-dependent fields visibility
    function updateNetworkFields(tabName) {
      const networkSelect = document.getElementById(`${tabName}-network`);
      const pathGroup = document.getElementById(`${tabName}-path-group`);
      const hostGroup = document.getElementById(`${tabName}-host-group`);
      
      if (networkSelect && pathGroup && hostGroup) {
        const showFields = networkSelect.value !== 'tcp';
        pathGroup.style.display = showFields ? 'block' : 'none';
        hostGroup.style.display = showFields ? 'block' : 'none';
      }
    }
    
    // Event listeners for network changes
    document.getElementById('vmess-network').addEventListener('change', function() {
      updateNetworkFields('vmess');
    });
    document.getElementById('vless-network').addEventListener('change', function() {
      updateNetworkFields('vless');
    });
    document.getElementById('trojan-network').addEventListener('change', function() {
      updateNetworkFields('trojan');
    });
    document.getElementById('ss-plugin').addEventListener('change', function() {
      const pluginOptions = document.getElementById('ss-plugin-options');
      pluginOptions.style.display = this.value === 'v2ray-plugin' ? 'block' : 'none';
    });
    
    // Generate UUID
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    // Auto-generate UUID if field is empty
    document.getElementById('vmess-id').addEventListener('focus', function() {
      if (!this.value) {
        this.value = generateUUID();
      }
    });
    
    document.getElementById('vless-id').addEventListener('focus', function() {
      if (!this.value) {
        this.value = generateUUID();
      }
    });
    
    // Copy to clipboard function
    function copyToClipboard(elementId) {
      const resultElement = document.getElementById(elementId);
      const textToCopy = resultElement.textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
    
    // Generate VMess link
    function generateVMess() {
      const address = document.getElementById('vmess-address').value;
      const port = document.getElementById('vmess-port').value;
      const id = document.getElementById('vmess-id').value;
      const security = document.getElementById('vmess-security').value;
      const network = document.getElementById('vmess-network').value;
      const path = document.getElementById('vmess-path').value;
      const host = document.getElementById('vmess-host').value || address;
      const tls = document.getElementById('vmess-tls').value;
      
      if (!address || !port || !id) {
        alert('Please fill in all required fields');
        return;
      }
      
      const config = {
        v: "2",
        ps: "Generated Config",
        add: address,
        port: port,
        id: id,
        aid: "0",
        scy: security,
        net: network,
        type: "none",
        host: host,
        path: path,
        tls: tls,
        sni: host
      };
      
      const base64Config = btoa(JSON.stringify(config));
      const vmessLink = `vmess://${base64Config}`;
      
      document.getElementById('vmess-result').textContent = vmessLink;
    }
    
    // Generate VLess link
    function generateVLess() {
      const address = document.getElementById('vless-address').value;
      const port = document.getElementById('vless-port').value;
      const id = document.getElementById('vless-id').value;
      const network = document.getElementById('vless-network').value;
      const path = document.getElementById('vless-path').value;
      const host = document.getElementById('vless-host').value || address;
      const tls = document.getElementById('vless-tls').value;
      
      if (!address || !port || !id) {
        alert('Please fill in all required fields');
        return;
      }
      
      let vlessLink = `vless://${id}@${address}:${port}?`;
      
      const params = new URLSearchParams();
      params.append('type', network);
      
      if (network !== 'tcp') {
        params.append('path', encodeURIComponent(path));
        params.append('host', host);
      }
      
      params.append('encryption', 'none');
      
      if (tls === 'tls') {
        params.append('security', 'tls');
        params.append('sni', host);
      } else {
        params.append('security', 'none');
      }
      
      vlessLink += params.toString();
      vlessLink += `#Generated_Config`;
      
      document.getElementById('vless-result').textContent = vlessLink;
    }
    
    // Generate Trojan link
    function generateTrojan() {
      const address = document.getElementById('trojan-address').value;
      const port = document.getElementById('trojan-port').value;
      const password = document.getElementById('trojan-password').value;
      const network = document.getElementById('trojan-network').value;
      const path = document.getElementById('trojan-path').value;
      const host = document.getElementById('trojan-host').value || address;
      
      if (!address || !port || !password) {
        alert('Please fill in all required fields');
        return;
      }
      
      let trojanLink = `trojan://${encodeURIComponent(password)}@${address}:${port}?`;
      
      const params = new URLSearchParams();
      params.append('type', network);
      
      if (network !== 'tcp') {
        params.append('path', encodeURIComponent(path));
        params.append('host', host);
      }
      
      params.append('security', 'tls');
      params.append('sni', host);
      
      trojanLink += params.toString();
      trojanLink += `#Generated_Config`;
      
      document.getElementById('trojan-result').textContent = trojanLink;
    }
    
    // Generate Shadowsocks link
    function generateSS() {
      const address = document.getElementById('ss-address').value;
      const port = document.getElementById('ss-port').value;
      const password = document.getElementById('ss-password').value;
      const method = document.getElementById('ss-method').value;
      const plugin = document.getElementById('ss-plugin').value;
      
      if (!address || !port || !password) {
        alert('Please fill in all required fields');
        return;
      }
      
      let ssLink = `ss://${btoa(`${method}:${password}`)}@${address}:${port}`;
      
      if (plugin === 'v2ray-plugin') {
        const path = document.getElementById('ss-path').value;
        const host = document.getElementById('ss-host').value || address;
        const tls = document.getElementById('ss-tls').value;
        
        const pluginOptions = [
          'mode=websocket',
          `host=${host}`,
          `path=${path}`
        ];
        
        if (tls === 'tls') {
          pluginOptions.push('tls');
        }
        
        ssLink += `/?plugin=v2ray-plugin%3B${encodeURIComponent(pluginOptions.join(';'))}`;
      }
      
      ssLink += `#Generated_Config`;
      
      document.getElementById('ss-result').textContent = ssLink;
    }
  </script>
</body>
</html>
