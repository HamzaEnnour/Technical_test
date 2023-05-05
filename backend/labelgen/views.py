from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Label
from .serializers import LabelSerializer

@api_view(['GET'])
def label_list(request):
    print('hello')
    labels = Label.objects.all()
    serializer = LabelSerializer(labels, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_label(request):
    label = LabelSerializer(data=request.data)
 
    # validating for already existing data
    if Label.objects.filter(**request.data).exists():
        raise serializers.ValidationError('This data already exists')
 
    if label.is_valid():
        label.save()
        return Response(label.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)