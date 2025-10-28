* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    text-align: center;
    color: white;
    margin-bottom: 40px;
}

.header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.header p {
    font-size: 1.1rem;
    opacity: 0.9;
}

.search-section {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    margin-bottom: 30px;
}

.search-form {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-bottom: 15px;
}

.form-group {
    flex: 1;
    min-width: 200px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
}

.search-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
    min-width: 150px;
}

.search-btn:hover:not(:disabled) {
    transform: translateY(-2px);
}

.search-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.search-btn:active {
    transform: translateY(0);
}

.search-info {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
}

.results-section {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    margin-bottom: 30px;
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
}

.results-title {
    color: #333;
    font-size: 1.5rem;
}

.results-count {
    font-size: 1.1rem;
    color: #666;
    font-weight: 600;
}

.events-container {
    position: relative;
    min-height: 200px;
}

.events-list {
    display: grid;
    gap: 20px;
}

.welcome-message {
    text-align: center;
    padding: 40px;
    color: #666;
    background: #f8f9fa;
    border-radius: 10px;
}

.welcome-message h3 {
    margin-bottom: 15px;
    color: #333;
}

.event-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 10px;
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.event-year {
    font-size: 0.9rem;
    color: #667eea;
    font-weight: 600;
    margin-bottom: 5px;
}

.event-title {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 10px;
    font-weight: 600;
}

.event-description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 15px;
}

.event-link {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.event-link:hover {
    background: #5a6fd8;
    color: white;
}

.loading {
    text-align: center;
    padding: 40px;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.no-results {
    text-align: center;
    padding: 40px;
    color: #666;
}

.error-message {
    text-align: center;
    padding: 40px;
    color: #dc3545;
    background: #f8d7da;
    border-radius: 10px;
}

.hidden {
    display: none;
}

.footer {
    text-align: center;
    color: white;
    padding: 20px;
    opacity: 0.8;
}

/* Адаптивность */
@media (max-width: 768px) {
    .search-form {
        flex-direction: column;
        align-items: stretch;
    }
    
    .form-group {
        min-width: auto;
    }
    
    .search-btn {
        width: 100%;
    }
    
    .results-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .header h1 {
        font-size: 2rem;
    }
    
    .event-card {
        padding: 15px;
    }
}
