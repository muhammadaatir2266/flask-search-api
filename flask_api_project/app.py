from flask import Flask, request, jsonify, render_template
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load CSV file
csv_file_path = 'scrapped_articles_data.csv'
df = pd.read_csv(csv_file_path)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search():
    keyword = request.args.get('keyword', '').lower().strip()

    if not keyword:
        return jsonify({"error": "Please provide a keyword to search."}), 400

    # Filter rows where 'title' contains the keyword (case-insensitive)
    matching_rows = df[df['title'].str.lower().str.contains(keyword, na=False)]

    if matching_rows.empty:
        return jsonify({"message": "No articles found with the given keyword."}), 404

    # Convert results to a list of dictionaries
    results = matching_rows.to_dict(orient='records')
    
    # Clean up NaN values
    for item in results:
        for key, value in item.items():
            if pd.isna(value):  # Check if value is NaN
                item[key] = None  # Convert NaN to None, which becomes null in JSON
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)