const AVATAR_COLORS = [
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#16a34a',
  '#0891b2',
  '#4f46e5',
  '#c026d3',
];

export default function Avatar({ user, size = 40, style }) {
  const name = user?.name || '';
  const email = user?.email || '';
  const initials = getInitials(name, email);
  const color = getColor(name || email);

  const sizeClasses = {
    24: 'w-6 h-6 text-[10px]',
    32: 'w-8 h-8 text-xs',
    40: 'w-10 h-10 text-sm',
  };

  const sizeClass = sizeClasses[size] || `w-10 h-10 text-sm`;

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none`}
      style={{ background: color, ...(style || {}) }}
      aria-label={name || 'User avatar'}
    >
      {initials}
    </div>
  );
}

function getInitials(name, email) {
  const source = name.trim() || email.trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    const first = parts[0].charAt(0);
    const last = parts[0].slice(-1);
    return (first + last).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

function getColor(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
