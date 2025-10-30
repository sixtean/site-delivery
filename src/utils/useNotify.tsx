import { useState, useCallback, useEffect } from "react";

export type NotifyType = "success" | "error" | "info" | "warning";

export interface NotifyOptions {
  id?: string;
  title: string;
  message: string;
  type?: NotifyType;
  duration?: number; // tempo total em ms
}

export function useNotify() {
  const [notifications, setNotifications] = useState<NotifyOptions[]>([]);

  const showNotify = useCallback((options: NotifyOptions) => {
    const id = options.id ?? Math.random().toString(36).substring(2, 9);
    const duration = options.duration ?? 5000;

    setNotifications((prev) => [...prev, { ...options, id }]);

    // Remoção com animação (espera um pouco antes de tirar do estado)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration + 300); // +300ms pra dar tempo da animação de saída
  }, []);

  return {
    showNotify,
    NotifyComponent: () => (
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notify={n} />
        ))}
      </div>
    ),
  };
}

// Componente individual da notificação
interface NotificationItemProps {
  notify: NotifyOptions;
}

const NotificationItem = ({ notify }: NotificationItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Controla a animação de saída
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, (notify.duration ?? 5000) - 300); // começa a animação antes de remover

    return () => clearTimeout(timer);
  }, [notify.duration]);

  // cores e ícones
  let bgColor = "bg-blue-100";
  let borderColor = "border-blue-500";
  let iconClass = "bi-info-circle text-blue-500";

  switch (notify.type) {
    case "success":
      bgColor = "bg-green-100";
      borderColor = "border-green-500";
      iconClass = "bi-check-circle text-green-500";
      break;
    case "error":
      bgColor = "bg-red-100";
      borderColor = "border-red-500";
      iconClass = "bi-x-circle text-red-500";
      break;
    case "warning":
      bgColor = "bg-yellow-100";
      borderColor = "border-yellow-500";
      iconClass = "bi-exclamation-triangle text-yellow-500";
      break;
  }

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border-l-4 cursor-pointer shadow-md
      ${bgColor} ${borderColor} min-w-[300px] max-w-[450px]
      transform transition-all duration-300
      ${isLeaving ? "opacity-0 translate-x-5" : "opacity-100 translate-x-0"}`}
      onClick={() => setExpanded(!expanded)}
    >
      <i className={`bi ${iconClass} text-2xl flex-shrink-0`}></i>
      <div className="flex flex-col">
        <h4 className="font-semibold text-gray-800">{notify.title}</h4>
        <p
          className={`text-gray-700 text-sm transition-all duration-300 ${
            expanded ? "max-h-full" : "max-h-6 overflow-hidden"
          }`}
        >
          {notify.message}
        </p>
      </div>
    </div>
  );
};