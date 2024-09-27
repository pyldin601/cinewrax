"use client";

import { ChangeEventHandler, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Input,
  Typography,
  FormHelperText,
} from "@mui/material";

interface Props {
  readonly sessionId: string;
}

export const ConvertForm: React.FC<Props> = ({ sessionId }) => {
  const [audioFormat, setAudioFormat] = useState("MP3");
  const [bitrate, setBitrate] = useState(128);
  const [file, setFile] = useState<null | File>(null);

  const handleAudioFormatChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setAudioFormat(event.target.value);
  };

  const handleBitrateChange = (event: Event, newValue: number | number[]) => {
    setBitrate(newValue as number);
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files === null || event.target.files.length === 0) {
      setFile(null);
      return;
    }

    setFile(event.target.files[0]);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 4 }}>
      <Typography variant="h4" component="h1">
        Audio Converter
      </Typography>

      {/* File Input */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Input type="file" onChange={handleFileChange} inputProps={{ accept: "audio/*" }} />
        <FormHelperText>{file ? `Selected: ${file.name}` : "Choose an audio file"}</FormHelperText>
      </FormControl>

      {/* Toggle for Audio Format */}
      <FormControl component="fieldset">
        <Typography component="legend">Select Audio Format</Typography>
        <RadioGroup
          aria-label="audio-format"
          name="audio-format"
          value={audioFormat}
          onChange={handleAudioFormatChange}
          row
        >
          <FormControlLabel value="MP3" control={<Radio />} label="MP3" />
          <FormControlLabel value="WAV" control={<Radio />} label="WAV" />
        </RadioGroup>
      </FormControl>

      {/* Bitrate Slider for MP3 */}
      {audioFormat === "MP3" && (
        <Box sx={{ mt: 4 }}>
          <Typography gutterBottom>Bitrate: {bitrate} kbps</Typography>
          <Slider value={bitrate} min={64} max={320} step={1} onChange={handleBitrateChange} valueLabelDisplay="auto" />
        </Box>
      )}

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 4 }}
        onClick={async () => {
          const response = fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
              transcodingId: "transcodingId",
              fileId: "fileId",
              filename: "filename",
            }),
          });

          console.log(response);
        }}
      >
        Convert Audio
      </Button>
      <FormHelperText>Session Id: {sessionId}</FormHelperText>
    </Box>
  );
};
