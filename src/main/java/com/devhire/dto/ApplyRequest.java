package com.devhire.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ApplyRequest {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("job_id")
    private Long jobId;

    @JsonProperty("cover_note")
    private String coverNote;

    public ApplyRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getCoverNote() {
        return coverNote;
    }

    public void setCoverNote(String coverNote) {
        this.coverNote = coverNote;
    }
}
