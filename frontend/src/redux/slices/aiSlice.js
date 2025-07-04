import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAIResponse = createAsyncThunk("ai/fetchResponse", async(message, thunkAPI) => {
    try {
    const response = await fetch("http://localhost:5002/api/ai-response", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ 
            message,
            userInfo: {
            name: "",
            category: "Technical",
        },
        
        priority: "Low",
     }),
    });

    if (!response.ok) throw new Error("AI failed to respond");

    const data = await response.json();
    return data.response;
} catch (error) {
    return thunkAPI.rejectWithValue(error.message);
}
});

const aiSlice = createSlice({
    name: "ai",
    initialState: {
        input: "",
        response: "",
        loading: false,
        error: null,
    },
    reducers: {
        setInput: (state, action) => {
            state.input = action.payload;
        },
        clearResponse: (state) => {
            state.response = "";
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAIResponse.pending, (state) => {
            state.loading = true;
            state.response = "";
            state.error = null;
        })
        .addCase(fetchAIResponse.fulfilled, (state, action) => {
            state.loading = false;
            state.response = action.payload;
        })
        .addCase(fetchAIResponse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "AI failed to respond";
        })
    },
});

export const { setInput, clearResponse } = aiSlice.actions;
export default aiSlice.reducer;