<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contents;
use App\Models\watch_laters;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailables\Content;
use Carbon\Carbon;

class WatchLaterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $watch = watch_laters::with(['User', 'Contents'])->get();

        return response([
            'message' => 'All Watch List Retrieved',
            'data' => $watch,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = User::find($request->idUser);
        if (!$user) {
            return response([
                'message' => 'User Not Found',
                'data' => null,
            ], 404);
        }

        $contents = Contents::find($request->idContent);
        if (!$contents) {
            return response([
                'message' => 'Content Not Found',
                'data' => null,
            ], 404);
        }

        if ($contents->id_user == $user->id) {
            return response([
                'message' => 'Can\'t add your own content to Watch Later',
                'data' => null,
            ], 404);
        }
        
        // Checking duplicate Watch Later Data in the list :
        $watch = watch_laters::where('id_user', $request->idUser)->where('id_content', $request->idcontent)->first();
        if(!is_null($watch)){
            return response([
                'message' => 'Content already in your Watch List',
                'data' => null,
            ], 404);
        }

        $data = [
            'id_user' => $user->id,
            'id_content' => $contents->id,
            'date_added' => now(), 
        ];

        $watch = watch_laters::create($data);
        return response([
            'message' => 'Added to your Watch Later List',
            'data' => $watch,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response([
                'message' => 'User Not Found',
                'data' => null,
            ], 404);
        }

        $watch = watch_laters::where('id_user', $id)->get()->map(function ($watchs) {
            return [
                'id' => $watchs->id,
                'id_user' => $watchs->id_user,
                'id_content' => $watchs->id_content,
                'date_added' => $watchs->date_added,
                'content' => $watchs->content,
            ];
        });

        return response([
            'message' => 'Watch Lists of ' . $user->name . ' Retrieved',
            'data' => $watch,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $watch = watch_laters::find($id);

        if (is_null($watch)) {
            return response([
                'message' => 'Watch List Not Found',
                'data' => null,
            ], 404);
        }

        if ($watch->delete()) {
            return response([
                'message' => 'Removed from your Watch Later List',
                'data' => $watch,
            ], 200);
        }

        return response([
            'message' => 'Delete Content Failed',
            'data' => null,
        ], 400);
    }
}
