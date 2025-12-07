'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, MapPin, Search, Filter, Ticket, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import TicketBookingDialog from '@/components/TicketBookingDialog'
import AnimatedHero from '@/components/AnimatedHero'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  
  // Booking dialog state
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const filterOptions = [
    { value: 'all', label: 'Tất cả sự kiện' },
    { value: 'on-sale', label: 'Đang bán vé' },
    { value: 'upcoming', label: 'Sắp mở bán' }
  ]

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, selectedFilter])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      if (data.success) {
        setEvents(data.data)
      }
    } catch (error) {
      console.error('Lỗi khi tải sự kiện:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    // Lọc theo trạng thái bán vé
    if (selectedFilter === 'on-sale') {
      filtered = filtered.filter(event => event.ticketSaleStatus.hasTicketsOnSale)
    } else if (selectedFilter === 'upcoming') {
      filtered = filtered.filter(event => 
        !event.ticketSaleStatus.hasTicketsOnSale && event.ticketSaleStatus.upcoming.length > 0
      )
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.event_type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }

  const handleBooking = (event) => {
    setSelectedEvent(event)
    setBookingDialogOpen(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="events" />

      <main>
        {/* Hero Section */}
        {/* Hero Section */}
        {/* Hero Section */}
        <AnimatedHero 
          variant="aurora"
          title="Khám Phá Sự Kiện Đang Diễn Ra"
          description="Đừng bỏ lỡ những khoảnh khắc đáng nhớ. Tìm kiếm và đặt vé ngay cho các sự kiện hot nhất: âm nhạc, hội thảo, lễ hội và nhiều hơn nữa."
          actions={
             <>
                <Badge variant="outline" className="border-white/20 text-white px-4 py-1.5 text-sm font-normal backdrop-blur-md">
                   🎵 Concerts
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white px-4 py-1.5 text-sm font-normal backdrop-blur-md">
                   🎤 Hội thảo
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white px-4 py-1.5 text-sm font-normal backdrop-blur-md">
                   🎨 Triển lãm
                </Badge>
                 <Badge variant="outline" className="border-white/20 text-white px-4 py-1.5 text-sm font-normal backdrop-blur-md">
                   🏃 Thể thao
                </Badge>
             </>
          }
        />

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm sự kiện</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Tìm theo tên, địa điểm..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={filterEvents} className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredEvents.length} sự kiện được tìm thấy
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Đang tải sự kiện...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Không tìm thấy sự kiện phù hợp.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedFilter('all')
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all hover:scale-105">
                    <div className="relative">
                      {/* Background with theme color if available */}
                      <div 
                        className="w-full h-48 flex items-center justify-center"
                        style={{
                          background: event.eventPlan?.mainColor 
                            ? `linear-gradient(135deg, ${event.eventPlan.mainColor} 0%, ${event.eventPlan.mainColor}dd 100%)`
                            : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
                        }}
                      >
                        <Ticket className="h-24 w-24 text-white opacity-50" />
                      </div>
                      
                      {/* Status Badge */}
                      {event.ticketSaleStatus.hasTicketsOnSale ? (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Đang bán vé
                        </div>
                      ) : event.ticketSaleStatus.upcoming.length > 0 ? (
                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Sắp mở bán
                        </div>
                      ) : null}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {event.event_type}
                        </Badge>
                        {event.eventPlan?.eventCategory && (
                          <Badge variant="secondary" className="text-xs">
                            {event.eventPlan.eventCategory}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-xl mb-2">{event.customer_name}</h3>
                      
                      {/* Event Plan Theme/Goal */}
                      {event.eventPlan?.theme && (
                        <p className="text-sm text-gray-600 mb-2 italic">
                          "{event.eventPlan.theme}"
                        </p>
                      )}
                      
                      {event.eventPlan?.goal && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          🎯 {event.eventPlan.goal}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(event.event_date)}
                          {event.event_time && ` - ${event.event_time}`}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.address}
                        </div>
                        
                        {/* Event Plan Additional Info */}
                        {event.eventPlan?.partner && (
                          <div className="text-xs text-gray-500">
                            🤝 Đối tác: {event.eventPlan.partner.name}
                          </div>
                        )}
                        
                        {event.eventPlan?.audience && (
                          <div className="text-xs text-gray-500">
                            👥 Đối tượng: {event.eventPlan.audience}
                          </div>
                        )}
                        
                        {event.eventPlan?.style && (
                          <div className="text-xs text-gray-500">
                            🎨 Phong cách: {event.eventPlan.style}
                          </div>
                        )}
                      </div>

                      {/* Ticket Sale Info */}
                      <div className="mb-4 space-y-2">
                        {event.ticketSaleStatus.onSale.length > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-xs font-semibold text-green-800 mb-1">Đang bán:</p>
                            <div className="flex flex-wrap gap-1">
                              {event.ticketSaleStatus.onSale.map((ticket, idx) => (
                                <Badge key={idx} className="bg-green-600 text-white text-xs">
                                  {ticket.ticket_type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {event.ticketSaleStatus.upcoming.length > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-xs font-semibold text-orange-800 mb-1">Sắp mở bán:</p>
                            {event.ticketSaleStatus.upcoming.map((ticket, idx) => (
                              <div key={idx} className="text-xs text-orange-700 mb-1">
                                <span className="font-medium">{ticket.ticket_type}</span>
                                <span className="text-orange-600"> - Mở bán: {formatDate(ticket.sale_start_date)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {event.ticketSaleStatus.onSale.length + event.ticketSaleStatus.upcoming.length} loại vé
                        </div>
                        <Button 
                          onClick={() => handleBooking(event)}
                          disabled={!event.ticketSaleStatus.hasTicketsOnSale}
                          className={event.ticketSaleStatus.hasTicketsOnSale 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "bg-gray-400 cursor-not-allowed"}>
                          {event.ticketSaleStatus.hasTicketsOnSale ? 'Đặt vé' : 'Chưa mở bán'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Ticket Booking Dialog */}
      <TicketBookingDialog 
        event={selectedEvent}
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
      />

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
