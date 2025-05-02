import React, { useState } from "react";

function MiniIcon({ type, isActive }) {
  // Estado para controlar el efecto hover
  const [isHovered, setIsHovered] = useState(false);
  
  // Función para manejar eventos de hover
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  // Propiedades compartidas para hover y eventos de mouse
  const iconProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    style: { cursor: 'pointer', transition: 'transform 0.2s ease-in-out' }
  };
  
  // Aplicar efecto de escala al hacer hover
  const scaleEffect = isHovered ? 'scale(1.1)' : 'scale(1)';
  
  switch (type) {
    case "masculino":
      return (
        <div
          {...iconProps}
          style={{
            width: 20,
            height: 20,
            background: "#ddd6fe",
            border: "2px solid #4f46e5",
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out",
            boxShadow: isHovered ? "0 0 5px rgba(79, 70, 229, 0.5)" : "none"
          }}
        />
      );
    case "femenino":
      return (
        <div
          {...iconProps}
          style={{
            width: 20,
            height: 20,
            borderRadius: "999px",
            background: "#fbcfe8",
            border: "2px solid #be185d",
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out",
            boxShadow: isHovered ? "0 0 5px rgba(190, 24, 93, 0.5)" : "none"
          }}
        />
      );
    case "fallecidoM":
      return (
        <div
          {...iconProps}
          style={{
            width: 20,
            height: 20,
            background: "#fee2e2",
            border: "2px solid #7f1d1d",
            position: "relative",
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out",
            boxShadow: isHovered ? "0 0 5px rgba(127, 29, 29, 0.5)" : "none"
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
          {...iconProps}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff1f2",
            border: "2px solid #be123c",
            position: "relative",
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out",
            boxShadow: isHovered ? "0 0 5px rgba(190, 18, 60, 0.5)" : "none"
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
          {...iconProps}
          style={{
            position: "relative",
            width: 20,
            height: 20,
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out"
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "20px solid white",
              position: "absolute",
              zIndex: 1,
              filter: isHovered ? "drop-shadow(0 0 2px rgba(0,0,0,0.3))" : "none",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "11px solid transparent",
              borderRight: "11px solid transparent",
              borderBottom: "22px solid black",
              position: "absolute",
              top: -1,
              left: -1,
              zIndex: 0,
            }}
          />
        </div>
      );
    case "abortoEspontaneo":
      return (
        <div
          {...iconProps}
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#000",
            marginRight: 6,
            marginLeft: 2,
            marginTop: 2,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out",
            boxShadow: isHovered ? "0 0 5px rgba(0, 0, 0, 0.5)" : "none"
          }}
        />
      );
    case "abortoProvocado":
      return (
        <div
          {...iconProps}
          style={{
            position: "relative",
            width: 20,
            height: 20,
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out"
          }}
        >
          <div
            style={{
              width: 2,
              height: 16,
              background: "#000",
              position: "absolute",
              top: 2,
              left: 9,
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: 2,
              height: 16,
              background: "#000",
              position: "absolute",
              top: 2,
              left: 9,
              transform: "rotate(-45deg)",
            }}
          />
        </div>
      );
    case "fetoMuerto":
      return (
        <div
          {...iconProps}
          style={{
            position: "relative",
            width: 20,
            height: 20,
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out"
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              background: "white",
              border: "2px solid #000",
              position: "absolute",
              top: 2,
              left: 2,
            }}
          >
            <div
              style={{
                width: 1,
                height: 14,
                background: "#000",
                position: "absolute",
                top: 1,
                left: 7,
                transform: "rotate(45deg)",
              }}
            />
            <div
              style={{
                width: 1,
                height: 14,
                background: "#000",
                position: "absolute",
                top: 1,
                left: 7,
                transform: "rotate(-45deg)",
              }}
            />
          </div>
        </div>
      );
    case "fetoMuertoMujer":
      return (
        <div
          {...iconProps}
          style={{
            position: "relative",
            width: 20,
            height: 20,
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out"
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              background: "white",
              border: "2px solid #000",
              borderRadius: "50%",
              position: "absolute",
              top: 2,
              left: 2,
            }}
          >
            <div
              style={{
                width: 1,
                height: 14,
                background: "#000",
                position: "absolute",
                top: 1,
                left: 7,
                transform: "rotate(45deg)",
              }}
            />
            <div
              style={{
                width: 1,
                height: 14,
                background: "#000",
                position: "absolute",
                top: 1,
                left: 7,
                transform: "rotate(-45deg)",
              }}
            />
          </div>
        </div>
      );
    case "adopcion":
      return (
        <div
          {...iconProps}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#e0f2fe",
            border: "2px dotted #4b5563",
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out",
            boxShadow: isHovered ? "0 0 5px rgba(75, 85, 99, 0.5)" : "none"
          }}
        />
      );
    case "paciente":
      return (
        <div
          {...iconProps}
          style={{
            width: 20,
            height: 20,
            background: "#dcfce7",  // Cambiado de #e0f7fa a #dcfce7 (verde claro)
            borderRadius: 4,
            border: "1px solid #10b981", // Cambiado de #0288d1 a #10b981 (verde)
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out",
            boxShadow: isHovered ? "0 0 5px rgba(16, 185, 129, 0.5)" : "none" // Cambiado rgba(2, 136, 209, 0.5) a rgba(16, 185, 129, 0.5)
          }}
        />
      );
    case "familyNode":
      return (
        <div
          {...iconProps}
          style={{
            width: 24,
            height: 24,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out"
          }}
        >
          {/* Círculo principal */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `radial-gradient(circle, #f8fafc 0%, #f8fafc 60%, #2563eb80 100%)`,
              boxShadow: `0 0 0 2px #2563eb, ${isHovered ? '0 0 10px rgba(37, 99, 235, 0.5)' : '0 0 8px rgba(37, 99, 235, 0.35)'}`,
              zIndex: 1,
            }}
          />
          
          {/* Líneas de aristas internas */}
          <div
            style={{
              position: "absolute",
              width: "70%",
              height: "70%",
              zIndex: 2,
            }}
          >
            {/* Línea vertical */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "0%",
                width: "1px",
                height: "100%",
                backgroundColor: "#2563eb90",
                transform: "translateX(-50%)",
              }}
            />
            
            {/* Línea horizontal */}
            <div
              style={{
                position: "absolute",
                left: "0%",
                top: "50%",
                width: "100%",
                height: "1px",
                backgroundColor: "#2563eb90",
                transform: "translateY(-50%)",
              }}
            />
          </div>
          
          {/* Punto central */}
          <div
            style={{
              width: `${24/5}px`,
              height: `${24/5}px`,
              backgroundColor: "#2563eb",
              borderRadius: "50%",
              boxShadow: `0 0 4px #2563eb`,
              zIndex: 3,
            }}
          />
          
          {/* Efecto adicional al estar activo */}
          {isActive && (
            <div
              style={{
                position: "absolute",
                width: "110%",
                height: "110%",
                borderRadius: "50%",
                border: "1px dashed #2563eb",
                opacity: 0.6,
                animation: "spin 8s linear infinite",
                zIndex: 0,
              }}
            />
          )}
        </div>
      );

    case "rectangle":
      return (
        <svg 
          width="26" 
          height="26" 
          viewBox="0 0 24 24" 
          style={{ 
            marginRight: 6,
            transform: scaleEffect,
            filter: isHovered || isActive ? "drop-shadow(0 0 3px rgba(79, 70, 229, 0.7))" : "none",
            transition: "all 0.2s ease-in-out"
          }}
          {...iconProps}
        >
          <defs>
            <linearGradient id="rectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isActive ? "#312e81" : "#4f46e5"} />
              <stop offset="100%" stopColor={isActive ? "#6366f1" : "#818cf8"} />
            </linearGradient>
            <pattern id="activePattern" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#312e81" strokeWidth="10" strokeOpacity="0.2"/>
            </pattern>
          </defs>
          <rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="2"
            ry="2"
            fill={isActive ? "url(#activePattern)" : "white"}
            stroke="url(#rectGradient)"
            strokeWidth={isActive || isHovered ? "3" : "2"}
          />
          <path
            fill="url(#rectGradient)"
            d="M19,21H5c-1.1,0-2-0.9-2-2V9h16v10C19,20.1,18.1,21,17,21z"
            opacity={isActive ? "0.4" : "0.3"}
          />
          {isActive && (
            <rect
              x="2"
              y="4"
              width="20"
              height="16"
              rx="2"
              ry="2"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
              opacity="0.5"
            />
          )}
        </svg>
      );
    
    case "circle":
      return (
        <svg 
          width="26" 
          height="26" 
          viewBox="0 0 24 24" 
          style={{ 
            marginRight: 6,
            transform: scaleEffect,
            filter: isHovered || isActive ? "drop-shadow(0 0 3px rgba(16, 185, 129, 0.7))" : "none",
            transition: "all 0.2s ease-in-out"
          }}
          {...iconProps}
        >
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isActive ? "#047857" : "#10b981"} />
              <stop offset="100%" stopColor={isActive ? "#34d399" : "#6ee7b7"} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#10b981" floodOpacity={isActive ? "0.5" : "0.3"}/>
            </filter>
            <pattern id="activeCirclePattern" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#047857" strokeWidth="10" strokeOpacity="0.2"/>
            </pattern>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="9"
            fill={isActive ? "url(#activeCirclePattern)" : "white"}
            stroke="url(#circleGradient)"
            strokeWidth={isActive || isHovered ? "3" : "2"}
            filter="url(#shadow)"
          />
          <circle
            cx="12"
            cy="12"
            r="5"
            fill="url(#circleGradient)"
            opacity={isActive ? "0.4" : "0.2"}
          />
          {isActive && (
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
              opacity="0.5"
            />
          )}
        </svg>
      );
    
    case "text":
      return (
        <svg 
          width="26" 
          height="26" 
          viewBox="0 0 24 24" 
          style={{ 
            marginRight: 6,
            transform: scaleEffect,
            filter: isHovered || isActive ? "drop-shadow(0 0 3px rgba(239, 68, 68, 0.7))" : "none",
            transition: "all 0.2s ease-in-out"
          }}
          {...iconProps}
        >
          <defs>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isActive ? "#b91c1c" : "#ef4444"} />
              <stop offset="100%" stopColor={isActive ? "#f87171" : "#fca5a5"} />
            </linearGradient>
            <pattern id="activeTextPattern" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#b91c1c" strokeWidth="10" strokeOpacity="0.2"/>
            </pattern>
          </defs>
          <path
            d="M5,3L4,4v16l1,1h14l1-1V4l-1-1H5z"
            fill={isActive ? "url(#activeTextPattern)" : "white"}
            stroke="url(#textGradient)"
            strokeWidth={isActive || isHovered ? "1.5" : "1"}
          />
          <path
            d="M7,7h10M7,12h10M7,17h7"
            stroke="url(#textGradient)"
            strokeWidth={isActive || isHovered ? "2.5" : "2"}
            strokeLinecap="round"
          />
          <text
            x="16"
            y="13"
            fontFamily="Arial"
            fontSize="10"
            fontWeight="bold"
            fill="url(#textGradient)"
          >
            T
          </text>
          {isActive && (
            <path
              d="M5,3L4,4v16l1,1h14l1-1V4l-1-1H5z"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
              opacity="0.5"
            />
          )}
        </svg>
      );
    
    case "note":
      return (
        <svg 
          width="26" 
          height="26" 
          viewBox="0 0 24 24" 
          style={{ 
            marginRight: 6,
            transform: scaleEffect,
            filter: isHovered || isActive ? "drop-shadow(0 0 3px rgba(234, 179, 8, 0.7))" : "none",
            transition: "all 0.2s ease-in-out"
          }}
          {...iconProps}
        >
          <defs>
            <linearGradient id="noteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isActive ? "#a16207" : "#eab308"} />
              <stop offset="100%" stopColor={isActive ? "#facc15" : "#fde047"} />
            </linearGradient>
            <pattern id="activeNotePattern" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#a16207" strokeWidth="10" strokeOpacity="0.2"/>
            </pattern>
          </defs>
          <path
            d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z"
            fill={isActive ? "url(#activeNotePattern)" : "#FFF9C4"}
            stroke="url(#noteGradient)"
            strokeWidth={isActive || isHovered ? "1.5" : "1"}
          />
          <path
            d="M19,3h-4.5l-1,1H5C3.9,4,3,4.9,3,6v13c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z"
            fill={isActive ? "#FDE68A" : "#FFEE58"}
            opacity={isActive ? "0.4" : "0.3"}
          />
          <path
            d="M7,9h10M7,12h10M7,15h7"
            stroke="url(#noteGradient)"
            strokeWidth={isActive || isHovered ? "2" : "1.5"}
            strokeLinecap="round"
          />
          <circle
            cx="19"
            cy="5"
            r="1.5"
            fill="url(#noteGradient)"
          />
          {isActive && (
            <path
              d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
              opacity="0.5"
            />
          )}
          {isActive && (
            <circle
              cx="5"
              cy="5"
              r="0.5"
              fill="#fff"
              opacity="0.8"
            />
          )}
        </svg>
      );

    default:
      return (
        <div
          {...iconProps}
          style={{
            width: 20,
            height: 20,
            background: "#ccc",
            marginRight: 6,
            transform: scaleEffect,
            transition: "all 0.2s ease-in-out",
            boxShadow: isHovered ? "0 0 5px rgba(0, 0, 0, 0.2)" : "none"
          }}
        />
      );
  }
}

export default MiniIcon;
