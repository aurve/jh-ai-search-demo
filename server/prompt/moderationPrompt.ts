const MODERATION_ASSIST_PROMPT = `

Classify the following content for health risk.

Return:
risk_score (0-100)
risk_category
reasons
flags for human review

Do not make final publish decisions.
`;

export default MODERATION_ASSIST_PROMPT;
