export function safeJsonParse<T>(response: string, context: string = 'AI response'): T {
    try {
        // Basic cleanup - remove markdown wrappers and control characters
        let cleanedResponse = response
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
            .trim();

        console.log(`Cleaned ${context}:`, cleanedResponse.substring(0, 200) + '...');

        // Remove trailing commas (common JSON issue)
        cleanedResponse = cleanedResponse.replace(/,(\s*[}\]])/g, '$1');

        // Try to parse directly
        return JSON.parse(cleanedResponse) as T;
    } catch (parseError) {
        console.error(`JSON parse error in ${context}:`, parseError);
        console.error(`Problematic JSON:`, response.substring(0, 500));
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        throw new Error(`Invalid JSON response from AI (${context}): ${errorMessage}`);
    }
}