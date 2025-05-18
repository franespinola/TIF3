// utils/appointmentUtils.js

export const getAppointmentTypeProps = (type) => {
  if (!type) {
    return {
      label: "Sin tipo",
      variant: "default",
      colorClass: "bg-gray-100 text-gray-600"
    };
  }

  switch (type.toLowerCase()) {
    case "primera_sesion_familiar":
      return {
        label: "Primera sesión familiar",
        variant: "primary",
        colorClass: "bg-indigo-100 text-indigo-700"
      };
    case "sesion_familiar":
      return {
        label: "Sesión regular",
        variant: "success",
        colorClass: "bg-emerald-100 text-emerald-700"
      };
    case "consulta":
      return {
        label: "Consulta",
        variant: "secondary",
        colorClass: "bg-blue-100 text-blue-700"
      };
    case "consulta_familiar":
      return {
        label: "Consulta familiar",
        variant: "secondary",
        colorClass: "bg-teal-100 text-teal-700"
      };
    case "seguimiento":
      return {
        label: "Seguimiento",
        variant: "info",
        colorClass: "bg-green-100 text-green-700"
      };
    case "emergencia":
      return {
        label: "Emergencia",
        variant: "destructive",
        colorClass: "bg-red-100 text-red-700"
      };
    default:
      return {
        label: type,
        variant: "default",
        colorClass: "bg-gray-100 text-gray-600"
      };
  }
};

export const getAppointmentStatusProps = (status) => {
  if (!status) {
    return {
      label: "Sin estado",
      colorClass: "bg-gray-100 text-gray-600"
    };
  }

  switch (status.toLowerCase()) {
    case "scheduled":
      return {
        label: "Agendada",
        colorClass: "bg-blue-100 text-blue-700"
      };
    case "confirmed":
      return {
        label: "Confirmada",
        colorClass: "bg-emerald-100 text-emerald-700"
      };
    case "rescheduled":
      return {
        label: "Reprogramada",
        colorClass: "bg-yellow-100 text-yellow-700"
      };
    case "in_progress":
      return {
        label: "En consulta",
        colorClass: "bg-indigo-100 text-indigo-700"
      };
    case "completed":
      return {
        label: "Finalizada",
        colorClass: "bg-green-100 text-green-700"
      };
    case "cancelled":
      return {
        label: "Cancelada",
        colorClass: "bg-red-100 text-red-700"
      };
    case "no_show":
      return {
        label: "Ausente",
        colorClass: "bg-gray-200 text-gray-700"
      };
    default:
      return {
        label: status,
        colorClass: "bg-gray-100 text-gray-600"
      };
  }
};
