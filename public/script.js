document.getElementById('generate-url').addEventListener('click', async () => {
    const message = document.getElementById('message').value;
    const password = document.getElementById('password').value;
    if (!message) {
        alert('Please enter a message.');
        return;
    }

    const response = await fetch('/encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, password }),
    });

    const data = await response.json();
    const baseUrl = window.location.origin;
    const generatedUrl = `${baseUrl}/decrypt?msg=${encodeURIComponent(data.encryptedMessage)}${data.encryptedPassword ? `&pwd=${encodeURIComponent(data.encryptedPassword)}` : ''}`;

    document.getElementById('generated-url').value = generatedUrl;
    document.getElementById('open-url').href = generatedUrl;
    document.getElementById('output').style.display = 'block';
});

document.getElementById('copy-url').addEventListener('click', () => {
    const url = document.getElementById('generated-url');
    url.select();
    document.execCommand('copy');
    alert('URL copied to clipboard!');
});
