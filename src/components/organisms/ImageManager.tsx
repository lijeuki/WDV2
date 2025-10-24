import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Image as ImageIcon,
  Upload,
  X,
  Download,
  ZoomIn,
  RotateCw,
  Maximize2,
  FileImage,
  Calendar,
} from 'lucide-react';

export interface DentalImage {
  id: string;
  patientId: string;
  type: 'photo' | 'xray' | 'scan';
  category: 'intraoral' | 'extraoral' | 'panoramic' | 'periapical' | 'bitewing' | 'cephalometric' | 'cbct' | 'other';
  filename: string;
  url: string;
  thumbnailUrl?: string;
  captureDate: string;
  description?: string;
  toothNumbers?: number[];
  tags?: string[];
  notes?: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface ImageManagerProps {
  patientId: string;
  doctorId: string;
  existingImages?: DentalImage[];
  onImagesChange?: (images: DentalImage[]) => void;
  onSave?: (images: DentalImage[]) => void;
}

export default function ImageManager({
  patientId,
  doctorId,
  existingImages = [],
  onImagesChange,
  onSave,
}: ImageManagerProps) {
  const [images, setImages] = useState<DentalImage[]>(existingImages);
  const [selectedImage, setSelectedImage] = useState<DentalImage | null>(null);
  const [uploadType, setUploadType] = useState<'photo' | 'xray' | 'scan'>('photo');
  const [uploadCategory, setUploadCategory] = useState<string>('intraoral');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: DentalImage = {
          id: crypto.randomUUID(),
          patientId,
          type: uploadType,
          category: uploadCategory as any,
          filename: file.name,
          url: e.target?.result as string,
          thumbnailUrl: e.target?.result as string,
          captureDate: new Date().toISOString().split('T')[0],
          uploadedBy: doctorId,
          uploadedAt: new Date().toISOString(),
          tags: [],
          toothNumbers: [],
        };

        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: DentalImage = {
            id: crypto.randomUUID(),
            patientId,
            type: uploadType,
            category: uploadCategory as any,
            filename: file.name,
            url: e.target?.result as string,
            thumbnailUrl: e.target?.result as string,
            captureDate: new Date().toISOString().split('T')[0],
            uploadedBy: doctorId,
            uploadedAt: new Date().toISOString(),
            tags: [],
            toothNumbers: [],
          };

          const updatedImages = [...images, newImage];
          setImages(updatedImages);
          onImagesChange?.(updatedImages);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
  };

  const updateImage = (imageId: string, field: keyof DentalImage, value: any) => {
    const updatedImages = images.map((img) =>
      img.id === imageId ? { ...img, [field]: value } : img
    );
    setImages(updatedImages);
    onImagesChange?.(updatedImages);

    if (selectedImage?.id === imageId) {
      setSelectedImage({ ...selectedImage, [field]: value });
    }
  };

  const handleSave = () => {
    onSave?.(images);
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="size-4" />;
      case 'xray':
        return <FileImage className="size-4" />;
      case 'scan':
        return <Maximize2 className="size-4" />;
      default:
        return <ImageIcon className="size-4" />;
    }
  };

  const getCategoryBadgeColor = (type: string) => {
    switch (type) {
      case 'photo':
        return 'bg-blue-100 text-blue-800';
      case 'xray':
        return 'bg-purple-100 text-purple-800';
      case 'scan':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="size-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold">Image & X-Ray Manager</h2>
              <p className="text-sm text-gray-600">
                {images.length} image(s) - Photos, X-Rays, and Scans
              </p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={images.length === 0}>
            <Download className="size-4 mr-2" />
            Save All Images
          </Button>
        </div>
      </Card>

      {/* Upload Area */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Image Type</Label>
              <Select value={uploadType} onValueChange={(value: any) => setUploadType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Clinical Photo</SelectItem>
                  <SelectItem value="xray">X-Ray</SelectItem>
                  <SelectItem value="scan">3D Scan / CBCT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intraoral">Intraoral</SelectItem>
                  <SelectItem value="extraoral">Extraoral</SelectItem>
                  <SelectItem value="panoramic">Panoramic X-Ray</SelectItem>
                  <SelectItem value="periapical">Periapical X-Ray</SelectItem>
                  <SelectItem value="bitewing">Bitewing X-Ray</SelectItem>
                  <SelectItem value="cephalometric">Cephalometric</SelectItem>
                  <SelectItem value="cbct">CBCT / 3D Scan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Drop images here or click to browse
            </h3>
            <p className="text-sm text-gray-500">
              Supports: JPEG, PNG, DICOM (up to 10MB per file)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full h-48 object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={getCategoryBadgeColor(image.type)}>
                    <span className="flex items-center gap-1">
                      {getCategoryIcon(image.type)}
                      {image.type}
                    </span>
                  </Badge>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2">
                  <p className="text-xs font-medium truncate">{image.filename}</p>
                  <p className="text-xs text-gray-600">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Image Details Panel */}
      {selectedImage && (
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Image Details</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Image Preview */}
            <div>
              <img
                src={selectedImage.url}
                alt={selectedImage.filename}
                className="w-full rounded-lg border"
              />
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ZoomIn className="size-4 mr-2" />
                  Zoom
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <RotateCw className="size-4 mr-2" />
                  Rotate
                </Button>
              </div>
            </div>

            {/* Details Form */}
            <div className="space-y-4">
              <div>
                <Label>Filename</Label>
                <Input value={selectedImage.filename} disabled />
              </div>

              <div>
                <Label>Capture Date</Label>
                <Input
                  type="date"
                  value={selectedImage.captureDate}
                  onChange={(e) =>
                    updateImage(selectedImage.id, 'captureDate', e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Brief description..."
                  value={selectedImage.description || ''}
                  onChange={(e) =>
                    updateImage(selectedImage.id, 'description', e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Tooth Numbers (comma-separated)</Label>
                <Input
                  placeholder="e.g., 11, 12, 21"
                  value={selectedImage.toothNumbers?.join(', ') || ''}
                  onChange={(e) =>
                    updateImage(
                      selectedImage.id,
                      'toothNumbers',
                      e.target.value.split(',').map((n) => parseInt(n.trim())).filter(Boolean)
                    )
                  }
                />
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  placeholder="e.g., before, caries, restoration"
                  value={selectedImage.tags?.join(', ') || ''}
                  onChange={(e) =>
                    updateImage(
                      selectedImage.id,
                      'tags',
                      e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    )
                  }
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Input
                  placeholder="Additional notes..."
                  value={selectedImage.notes || ''}
                  onChange={(e) => updateImage(selectedImage.id, 'notes', e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Badge variant="secondary">
                  <Calendar className="size-3 mr-1" />
                  Uploaded: {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
