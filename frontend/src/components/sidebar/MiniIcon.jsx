import React from "react";

function MiniIcon({ type }) {
  switch (type) {
    case "masculino":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            background: "#ddd6fe",
            border: "2px solid #4f46e5",
            marginRight: 6,
          }}
        />
      );
    case "femenino":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "999px",
            background: "#fbcfe8",
            border: "2px solid #be185d",
            marginRight: 6,
          }}
        />
      );
    case "fallecidoM":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            background: "#fee2e2",
            border: "2px solid #7f1d1d",
            position: "relative",
            marginRight: 6,
          }}
        >
          <div
            style={{
              width: 2,
              height: 28,
              background: "#7f1d1d",
              position: "absolute",
              top: -4,
              left: 9,
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: 2,
              height: 28,
              background: "#7f1d1d",
              position: "absolute",
              top: -4,
              left: 9,
              transform: "rotate(-45deg)",
            }}
          />
        </div>
      );
    case "fallecidoF":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff1f2",
            border: "2px solid #be123c",
            position: "relative",
            marginRight: 6,
          }}
        >
          <div
            style={{
              width: 2,
              height: 28,
              background: "#be123c",
              position: "absolute",
              top: -4,
              left: 9,
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: 2,
              height: 28,
              background: "#be123c",
              position: "absolute",
              top: -4,
              left: 9,
              transform: "rotate(-45deg)",
            }}
          />
        </div>
      );
    case "embarazo":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fffbe6",
            border: "2px dashed #facc15",
            marginRight: 6,
          }}
        />
      );
    case "aborto":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fcd34d",
            border: "2px solid #b45309",
            position: "relative",
            marginRight: 6,
          }}
        >
          <div
            style={{
              width: 2,
              height: 20,
              background: "#b45309",
              position: "absolute",
              top: 0,
              left: 9,
            }}
          />
        </div>
      );
    case "adopcion":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#e0f2fe",
            border: "2px dotted #4b5563",
            marginRight: 6,
          }}
        />
      );
    case "paciente":
      return (
        <div
          style={{
            width: 20,
            height: 20,
            background: "#e0f7fa",
            borderRadius: 4,
            border: "1px solid #0288d1",
            marginRight: 6,
          }}
        />
      );
    default:
      return (
        <div
          style={{
            width: 20,
            height: 20,
            background: "#ccc",
            marginRight: 6,
          }}
        />
      );
  }
}

export default MiniIcon;
