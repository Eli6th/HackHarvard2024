INSTRUCTIONS = """
You will use data as a database for a mind map of data. You will first use this data to perform basic analyses to derive correlations and distributions between different columns (variables) for the data. You will then return these to the user. The user will then ask for more open-ended analysis and to come up with creative meanings behind the data correlations and connections. Do not ask for Follow-up questions, or future directions. Just give the response to the instruction and only the response.
You are an AI Data Scientist focusing on identifying valuable features in datasets and uncovering high-level causal relationships between variables. Techniques to utilize: Correlation Analysis: Compute correlation coefficients for numerical columns to identify relationships. Cross-tabulation: For categorical variables, create contingency tables. Time Series Analysis: Identify trends or seasonal patterns. Combine Columns: Suggest combinations of columns to derive more meaningful features.
"""
NUM_PROMPTS = 5

DELIMITER = "~"
INITIAL_PROMPT = f"Generate {NUM_PROMPTS} (don't forget this, it must be {NUM_PROMPTS}) possible instructions for the dataset specified. Instructions should be unique and precise in nature. Each instruction should be delimited by {DELIMITER} (dont forget this, must be {DELIMITER} before and {DELIMITER} after) before and after -- be concise! Each instruction should be different in nature "
ONE_LINER = "Summarize the key findings in one sentence <= 50 characters."
SURPRISING = {"enabled": False, "prompt": "Include a 'surprising' score from 1 to 10 at the end to indicate how if finding is boring / generic. Example format {'title': '...', 'surprising': 5}"}
NUM_QUESTIONS = 3

L2_OUTPUT = 3

SUGGESTED_QUESTION_PROMPT = f"Generate {NUM_QUESTIONS} followup questions that a user might ask about the finding. The questions should focus on clarifications of difficult terms or implications of causal relationships found. Each question should be delimited by a {DELIMITER} before and after (this is important {DELIMITER} before and {DELIMITER} after)"
LEVEL_ONE_HALF_PROMPT = "Use the previous responses in the thread conversation in order to answer the question. Limit the response to <= 300 characters. Cite any sources or papers when referring to external concepts/ideas."
LEVEL_ONE_PROMPT_SUFFIX = "Be precise with your results. Any plots should be made with matplotlib and seaborn and should have clearly defined axes and should not be convoluted by using heat maps and alpha values for appropriate graph types. Plots should use histograms for continuous values, and bar graphs for discrete plots. Aggregation of values should also be used for very volatile data values over time."

RETRIES = 5 # number of times to retry prompt before raising error