from flask import Flask, request, jsonify
from pulp import LpMaximize, LpProblem, LpVariable, lpSum

app = Flask(__name__)

# Function to find the optimal route based on provided data attributes
def find_optimal_route(data_attributes):
    # Create the MILP problem
    problem = LpProblem("RouteOptimization", LpMaximize)

    # Define binary decision variables for each route
    route1_var = LpVariable("Route1", cat="Binary")
    route2_var = LpVariable("Route2", cat="Binary")

    # Define weights for the objective function
    weight_distance = -0.8  # Use negative weight to minimize distance
    weight_duration = -0.4  # Use negative weight to minimize duration
    weight_traffic = 1.0    # Use higher positive weight for better traffic conditions
    weight_road_type = 1.2  # Use positive weight for preferred road type
    weight_road_confidence = 1.0  # Positive weight for road confidence

    # Define the objective function
    objective = lpSum([
        weight_distance * (data_attributes['route1']['distance'] * route1_var + data_attributes['route2']['distance'] * route2_var),
        weight_duration * (data_attributes['route1']['duration'] * route1_var + data_attributes['route2']['duration'] * route2_var),
        weight_traffic * (data_attributes['route1']['traffic'] * route1_var + data_attributes['route2']['traffic'] * route2_var),
        weight_road_type * (data_attributes['route1']['road_type'] * route1_var + data_attributes['route2']['road_type'] * route2_var),
        weight_road_confidence * (data_attributes['route1']['road_confidence'] * route1_var + data_attributes['route2']['road_confidence'] * route2_var)
    ])

    # Add the objective function to the problem
    problem += objective, "Optimize Route Based on Multiple Parameters"

    # Add constraints
    # Constraint: Only one route can be chosen (either route1_var or route2_var)
    problem += route1_var + route2_var == 1, "Choose_One_Route"

    # Solve the problem
    problem.solve()

    # Determine the optimal route based on the decision variables' values
    if route1_var.value() == 1:
        return data_attributes['route1']
    elif route2_var.value() == 1:
        return data_attributes['route2']

# Flask route to handle POST requests
@app.route('/optimize', methods=['POST'])
def optimize_route():
    # Get the JSON data from the request
    json_data = request.get_json()

    

    # Extract data_attributes from the JSON data
    data_attributes = json_data.get("data_attributes", {})
    
    # Check for the presence of 'route1' and 'route2' keys
    if 'route1' not in data_attributes or 'route2' not in data_attributes:
        print("Error: 'route1' or 'route2' key missing in data_attributes")
        return None

    # Find the optimal route based on the data attributes
    optimal_route = find_optimal_route(data_attributes)

    # Return the optimal route as a JSON response
    return jsonify(optimal_route)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)




# Example data
# data_attributes = {
#     "route1": {
#         "distance": 110.0,    # Distance in km
#         "duration": 32.0,     # Duration in minutes
#         "traffic": 2,         # Traffic condition rating (lower value is better)
#         "road_type": 3,       # Road type rating (higher value is better)
#         "weather": 1          # Weather condition rating (higher value is better)
#     },
#     "route2": {
#         "distance": 1050.0,   # Distance in km
#         "duration": 30.5,     # Duration in minutes
#         "traffic": 5,         # Traffic condition rating (higher value is worse)
#         "road_type": 2,       # Road type rating (lower value is worse)
#         "weather": 1          # Weather condition rating (same as route1)
#     }
# }