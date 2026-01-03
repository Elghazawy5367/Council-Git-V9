export const ExpertLegacy = ({ name }: { name: string }) => {
  return (
    <div className="p-4 border border-dashed border-gray-400 opacity-70">
      <p className="text-sm font-mono">[LEGACY] {name}</p>
    </div>
  );
};

// Fixed: export default export ExpertLegacy = {};
