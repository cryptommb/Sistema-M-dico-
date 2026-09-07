import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  Minus,
  CheckCircle2,
  Boxes,
  Sparkles,
  Layers,
  ArrowDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockItem } from '../../types';

export const InventoryView: React.FC = () => {
  const { stockItems, procedureKits, updateStockQuantity, addStockItem, consumeKit } = useApp();

  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Descartáveis');
  const [quantity, setQuantity] = useState(20);
  const [minQuantity, setMinQuantity] = useState(5);
  const [unit, setUnit] = useState<StockItem['unit']>('unidade');
  const [location, setLocation] = useState('Armário Principal');
  const [costPerUnit, setCostPerUnit] = useState(5.00);

  const [selectedKitToConsume, setSelectedKitToConsume] = useState('');
  const [showKitToast, setShowKitToast] = useState(false);

  const handleCreateStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addStockItem({
      name,
      category,
      quantity,
      minQuantity,
      unit,
      location,
      costPerUnit
    });

    setShowNewItemModal(false);
    setName('');
  };

  const handleManualKitConsumption = (kitId: string) => {
    consumeKit(kitId);
    setShowKitToast(true);
    setTimeout(() => setShowKitToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Controle de Estoque e Kits Cirúrgicos / Procedimentos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão de insumos fracionados (mL, ampolas, unidades) e baixa automatizada (PRD Seção 13)
          </p>
        </div>

        <button
          onClick={() => setShowNewItemModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Insumo / Medicamento
        </button>
      </div>

      {/* Procedure Kits Section (PRD 13.2) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-600" />
              Kits de Procedimento Cadastrados (PRD Seção 13.2)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ao vincular um kit na consulta do paciente ou clicar em "Dar Baixa Manual", os insumos correspondentes são debitados simultaneamente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {procedureKits.map(kit => (
            <div
              key={kit.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">{kit.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {kit.specialty}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{kit.description}</p>

                <div className="mt-3 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Composição do Kit:</div>
                  {kit.items.map((item, idx) => (
                    <div key={idx} className="text-xs text-slate-700 flex justify-between bg-white px-2 py-1 rounded border border-slate-200/60">
                      <span>• {item.stockItemName}</span>
                      <span className="font-semibold text-indigo-700">{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => handleManualKitConsumption(kit.id)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  Dar Baixa Manual do Kit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Items Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
          <span>Insumos e Materiais em Estoque ({stockItems.length})</span>
          <span className="text-slate-400 font-normal">Controle em tempo real de saldo físico</span>
        </div>

        <div className="divide-y divide-slate-100">
          {stockItems.map(item => {
            const isLow = item.quantity <= item.minQuantity;
            return (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 text-xs transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {item.category}
                    </span>
                    {isLow && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Estoque Baixo
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    Local: {item.location} • Custo Unitário: R$ {item.costPerUnit.toFixed(2)} • Mínimo de Segurança: {item.minQuantity} {item.unit}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900">
                      {item.quantity} <span className="text-xs font-medium text-slate-500">{item.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateStockQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
                      title="Diminuir 1 unidade"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateStockQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
                      title="Adicionar 1 unidade"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kit Consumption Success Toast */}
      {showKitToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div>Baixa de kit efetuada com sucesso!</div>
            <div className="text-slate-400 font-normal text-[11px]">
              Todos os insumos do kit foram debitados do estoque.
            </div>
          </div>
        </div>
      )}

      {/* New Stock Item Modal */}
      {showNewItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Cadastrar Insumo / Medicamento</h2>
              <button onClick={() => setShowNewItemModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStockItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Nome do Item *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Toxina Botulínica 100U ou Álcool 70%"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
                  >
                    <option value="Injetáveis">Injetáveis</option>
                    <option value="Anestésicos">Anestésicos</option>
                    <option value="Descartáveis">Descartáveis</option>
                    <option value="EPIs">EPIs</option>
                    <option value="Cirúrgico">Cirúrgico</option>
                    <option value="Antissépticos">Antissépticos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Unidade de Medida
                  </label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value as StockItem['unit'])}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
                  >
                    <option value="unidade">Unidade (un)</option>
                    <option value="ampola">Ampola</option>
                    <option value="mL">Mililitros (mL)</option>
                    <option value="frasco">Frasco</option>
                    <option value="par">Par</option>
                    <option value="caixa">Caixa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Quantidade Inicial
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Estoque Mínimo de Alerta
                  </label>
                  <input
                    type="number"
                    value={minQuantity}
                    onChange={e => setMinQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Local de Armazenamento
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Ex: Geladeira 01 ou Gaveta 3"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Custo Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPerUnit}
                    onChange={e => setCostPerUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewItemModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  Salvar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
