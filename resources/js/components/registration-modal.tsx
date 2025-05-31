'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useState } from 'react';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        framework: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
        // Aquí puedes agregar la lógica para enviar los datos
        onClose();
    };

    const handleCancel = () => {
        setFormData({ titulo: '', descripcion: '', framework: '' });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="border-gray-700 bg-gray-900 p-0 text-white sm:max-w-md">
                <div className="relative p-6">
                    {/* Close button */}
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white">
                        <X className="h-4 w-4" />
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Título */}
                        <div className="space-y-2">
                            <Label htmlFor="titulo">Título</Label>
                            <Input
                                id="titulo"
                                value={formData.titulo}
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                required
                            />
                        </div>

                        {/* Framework Select */}
                        <div className="space-y-2">
                            <Select value={formData.framework} onValueChange={(value) => setFormData({ ...formData, framework: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select framework..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="react" className="text-white hover:bg-gray-100">
                                        React
                                    </SelectItem>
                                    <SelectItem value="vue" className="text-white hover:bg-gray-100">
                                        Vue.js
                                    </SelectItem>
                                    <SelectItem value="angular" className="text-white hover:bg-gray-100">
                                        Angular
                                    </SelectItem>
                                    <SelectItem value="svelte" className="text-white hover:bg-gray-100">
                                        Svelte
                                    </SelectItem>
                                    <SelectItem value="nextjs" className="text-white hover:bg-gray-100">
                                        Next.js
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button type="button" variant="ghost" onClick={handleCancel} className="text-gray-300 hover:bg-gray-800 hover:text-white">
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-orange-600 text-white hover:bg-orange-700">
                                Registrar
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
