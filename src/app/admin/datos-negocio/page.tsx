'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Phone, Mail, MapPin, Globe, Clock, MessageCircle } from 'lucide-react'
import {
  ResponsiveFormGrid,
  FormSection,
  CompactForm,
  FormField,
  TextInput,
  TextAreaInput,
  CompactRow
} from '@/components/admin/responsive-form-grid'

export default function DatosNegocioPage() {
    const [formData, setFormData] = useState({
        nombreNegocio: '',
        descripcion: '',
        telefono: '',
        email: '',
        direccion: '',
        sitioWeb: '',
        horarioAtencion: '',
        redesSociales: {
            facebook: '',
            instagram: '',
            twitter: '',
            whatsapp: ''
        }
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleRedSocialChange = (red: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            redesSociales: {
                ...prev.redesSociales,
                [red]: value
            }
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Guardando datos del negocio:', formData)
        // Aquí iría la lógica para guardar en la base de datos
    }

    return (
        <div className="p-6">
            <CompactForm
                title="Datos del Negocio"
                description="Configura la información básica de tu negocio"
                icon={<Building2 className="h-8 w-8 text-yellow-400" />}
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Layout de 3 Columnas para las secciones principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* COLUMNA 1: Información Básica */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white flex items-center gap-2 text-lg">
                                    <Building2 className="h-5 w-5 text-yellow-400" />
                                    Información Básica
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormSection
                                    description="Nombre y descripción principal de tu negocio"
                                    icon={<Building2 className="h-5 w-5 text-yellow-400" />}
                                    cols={{ mobile: 1, tablet: 1, notebook: 1, desktop: 1 }}
                                >
                                    <FormField
                                        label="Nombre del Negocio"
                                        required
                                        icon={<Building2 className="h-4 w-4" />}
                                    >
                                        <TextInput
                                            id="nombreNegocio"
                                            value={formData.nombreNegocio}
                                            onChange={(value) => handleInputChange('nombreNegocio', value)}
                                            placeholder="Ej: Mi Tienda Online"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Descripción"
                                        description="Describe brevemente tu negocio"
                                        icon={<Globe className="h-4 w-4" />}
                                    >
                                        <TextAreaInput
                                            id="descripcion"
                                            value={formData.descripcion}
                                            onChange={(value) => handleInputChange('descripcion', value)}
                                            placeholder="Describe brevemente tu negocio..."
                                            rows={6}
                                        />
                                    </FormField>
                                </FormSection>
                            </CardContent>
                        </Card>

                        {/* COLUMNA 2: Información de Contacto */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-white flex items-center gap-2 text-lg">
                                    <Phone className="h-5 w-5 text-yellow-400" />
                                    Información de Contacto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormSection
                                    description="Teléfono, email y dirección de contacto"
                                    icon={<Phone className="h-5 w-5 text-yellow-400" />}
                                    cols={{ mobile: 1, tablet: 1, notebook: 1, desktop: 1 }}
                                >
                                    <FormField
                                        label="Teléfono"
                                        icon={<Phone className="h-4 w-4" />}
                                    >
                                        <TextInput
                                            id="telefono"
                                            type="tel"
                                            value={formData.telefono}
                                            onChange={(value) => handleInputChange('telefono', value)}
                                            placeholder="+56 9 1234 5678"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Email"
                                        icon={<Mail className="h-4 w-4" />}
                                    >
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(value) => handleInputChange('email', value)}
                                            placeholder="contacto@negocio.com"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Dirección"
                                        icon={<MapPin className="h-4 w-4" />}
                                    >
                                        <TextInput
                                            id="direccion"
                                            value={formData.direccion}
                                            onChange={(value) => handleInputChange('direccion', value)}
                                            placeholder="Calle Principal #123, Ciudad"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Sitio Web"
                                        icon={<Globe className="h-4 w-4" />}
                                    >
                                        <TextInput
                                            id="sitioWeb"
                                            type="url"
                                            value={formData.sitioWeb}
                                            onChange={(value) => handleInputChange('sitioWeb', value)}
                                            placeholder="https://www.mitienda.com"
                                        />
                                    </FormField>
                                </FormSection>
                            </CardContent>
                        </Card>

                        {/* COLUMNA 3: Horario y Redes Sociales */}
                        <div className="space-y-6">
                            {/* Horario de Atención */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                                        <Clock className="h-5 w-5 text-yellow-400" />
                                        Horario de Atención
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormSection
                                        description="Define tus horarios de atención"
                                        icon={<Clock className="h-4 w-5 text-yellow-400" />}
                                        cols={{ mobile: 1, tablet: 1, notebook: 1, desktop: 1 }}
                                    >
                                        <FormField label="Horario" icon={<Clock className="h-4 w-4" />}>
                                            <TextAreaInput
                                                id="horarioAtencion"
                                                value={formData.horarioAtencion}
                                                onChange={(value) => handleInputChange('horarioAtencion', value)}
                                                placeholder="Lunes a Viernes: 9:00 - 18:00&#10;Sábados: 10:00 - 14:00&#10;Domingos: Cerrado"
                                                rows={4}
                                            />
                                        </FormField>
                                    </FormSection>
                                </CardContent>
                            </Card>

                            {/* Redes Sociales */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                                        <MessageCircle className="h-5 w-5 text-yellow-400" />
                                        Redes Sociales
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormSection
                                        description="Enlaces a tus redes sociales"
                                        icon={<MessageCircle className="h-4 w-5 text-yellow-400" />}
                                    >
                                        <div className="space-y-3">
                                            <FormField label="Facebook">
                                                <TextInput
                                                    id="facebook"
                                                    type="url"
                                                    value={formData.redesSociales.facebook}
                                                    onChange={(value) => handleRedSocialChange('facebook', value)}
                                                    placeholder="https://facebook.com/mitienda"
                                                />
                                            </FormField>

                                            <FormField label="Instagram">
                                                <TextInput
                                                    id="instagram"
                                                    type="url"
                                                    value={formData.redesSociales.instagram}
                                                    onChange={(value) => handleRedSocialChange('instagram', value)}
                                                    placeholder="https://instagram.com/mitienda"
                                                />
                                            </FormField>

                                            <FormField label="Twitter/X">
                                                <TextInput
                                                    id="twitter"
                                                    type="url"
                                                    value={formData.redesSociales.twitter}
                                                    onChange={(value) => handleRedSocialChange('twitter', value)}
                                                    placeholder="https://twitter.com/mitienda"
                                                />
                                            </FormField>

                                            <FormField label="WhatsApp">
                                                <TextInput
                                                    id="whatsapp"
                                                    type="tel"
                                                    value={formData.redesSociales.whatsapp}
                                                    onChange={(value) => handleRedSocialChange('whatsapp', value)}
                                                    placeholder="+56 9 1234 5678"
                                                />
                                            </FormField>
                                        </div>
                                    </FormSection>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600"
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </CompactForm>
        </div>
    )
}
